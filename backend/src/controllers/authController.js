import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import { parseBirthDate } from "../utils/dates.js";
import { USER_COLUMNS, serializeUser } from "../utils/user.js";

const USERNAME_RE = /^[A-Za-z0-9_.-]{3,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v) => (typeof v === "string" ? v.trim() : "");

function signToken(userId) {
  return jwt.sign({}, env.jwtSecret, { subject: String(userId), expiresIn: env.jwtExpiresIn });
}

export async function register(req, res) {
  const firstName = str(req.body.firstName);
  const lastName = str(req.body.lastName);
  const location = str(req.body.location) || null;
  const email = str(req.body.email).toLowerCase();
  const username = str(req.body.username);
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const birthDate = parseBirthDate(req.body.birthDate);

  if (!EMAIL_RE.test(email) || email.length > 255) throw new HttpError(400, "E-mail inválido.");
  if (!USERNAME_RE.test(username)) {
    throw new HttpError(400, "ID de usuário deve ter de 3 a 30 caracteres (letras, números, _ . -).");
  }
  if (password.length < 8) throw new HttpError(400, "A senha precisa ter pelo menos 8 caracteres.");
  if (Buffer.byteLength(password) > 72) throw new HttpError(400, "A senha é longa demais (máx. 72 bytes).");
  if (firstName.length > 100 || lastName.length > 100 || (location && location.length > 120)) {
    throw new HttpError(400, "Um dos campos excede o tamanho permitido.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let insertId;
  try {
    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, birth_date, location)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, passwordHash, firstName, lastName, birthDate, location]
    );
    insertId = result.insertId;
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      const field = /email/i.test(err.sqlMessage || "") ? "E-mail" : "ID de usuário";
      throw new HttpError(409, `${field} já cadastrado.`);
    }
    throw err;
  }

  const [rows] = await pool.execute(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`, [insertId]);
  res.status(201).json({ token: signToken(insertId), user: serializeUser(rows[0]) });
}

export async function login(req, res) {
  const identifier = str(req.body.usernameOrEmail);
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!identifier || !password) throw new HttpError(400, "Preencha usuário e senha.");

  const [rows] = await pool.execute(
    `SELECT ${USER_COLUMNS}, password_hash FROM users WHERE username = ? OR email = ? LIMIT 1`,
    [identifier, identifier.toLowerCase()]
  );
  const row = rows[0];
  const ok = row && (await bcrypt.compare(password, row.password_hash));
  if (!ok) throw new HttpError(401, "Usuário ou senha inválidos.");

  res.json({ token: signToken(row.id), user: serializeUser(row) });
}
