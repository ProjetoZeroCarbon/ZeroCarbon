import { pool } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";
import { toDataUrl } from "../utils/image.js";
import { USER_COLUMNS, serializeUser } from "../utils/user.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function findUser(id) {
  const [rows] = await pool.execute(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`, [id]);
  if (!rows[0]) throw new HttpError(404, "Usuário não encontrado.");
  return rows[0];
}

async function findAvatarUrl(userId) {
  const [rows] = await pool.execute(
    "SELECT mime_type, data FROM user_avatars WHERE user_id = ?",
    [userId]
  );
  return rows[0] ? toDataUrl(rows[0].mime_type, rows[0].data) : null;
}

async function buildProfile(userId) {
  const [row, avatarUrl] = await Promise.all([findUser(userId), findAvatarUrl(userId)]);
  return { ...serializeUser(row), avatarUrl };
}

export async function getProfile(req, res) {
  res.json(await buildProfile(req.userId));
}

// Campos editáveis (whitelist): coluna no banco <- chave no corpo da requisição
const EDITABLE = {
  first_name: "firstName",
  last_name: "lastName",
  location: "location",
  email: "email",
};

export async function updateProfile(req, res) {
  const sets = [];
  const values = [];

  for (const [column, key] of Object.entries(EDITABLE)) {
    if (typeof req.body[key] !== "string") continue;
    let value = req.body[key].trim();

    if (key === "email") {
      value = value.toLowerCase();
      if (!EMAIL_RE.test(value) || value.length > 255) throw new HttpError(400, "E-mail inválido.");
    }
    if (key === "location") {
      if (value.length > 120) throw new HttpError(400, "Localização longa demais.");
      value = value || null;
    }
    if ((key === "firstName" || key === "lastName") && value.length > 100) {
      throw new HttpError(400, "Nome longo demais.");
    }

    sets.push(`${column} = ?`);
    values.push(value);
  }

  if (sets.length) {
    try {
      await pool.execute(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, [...values, req.userId]);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") throw new HttpError(409, "E-mail já cadastrado.");
      throw err;
    }
  }

  res.json(await buildProfile(req.userId));
}
