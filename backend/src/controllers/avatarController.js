import { pool } from "../config/db.js";
import { parseImageDataUrl, toDataUrl } from "../utils/image.js";

export async function setAvatar(req, res) {
  const { mime, buffer } = parseImageDataUrl(req.body?.image);

  await pool.execute(
    `INSERT INTO user_avatars (user_id, mime_type, data) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE mime_type = VALUES(mime_type), data = VALUES(data)`,
    [req.userId, mime, buffer]
  );

  res.json({ avatarUrl: toDataUrl(mime, buffer) });
}

export async function removeAvatar(req, res) {
  await pool.execute("DELETE FROM user_avatars WHERE user_id = ?", [req.userId]);
  res.json({ avatarUrl: null });
}
