import mysql from "mysql2/promise";
import { env } from "./env.js";

export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true, // DECIMAL volta como number (o frontend usa .toFixed)
  dateStrings: true,    // DATE volta como "YYYY-MM-DD", sem deslocamento de fuso
});
