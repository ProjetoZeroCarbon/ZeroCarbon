import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import "dotenv/config";

const dbName = process.env.DB_NAME || "zerocarbon";
if (!/^[A-Za-z0-9_]+$/.test(dbName)) {
  console.error("DB_NAME inválido: use apenas letras, números e _.");
  process.exit(1);
}

const schemaPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../sql/schema.sql");

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
});

try {
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.query(`USE \`${dbName}\``);
  await conn.query(await fs.readFile(schemaPath, "utf8"));
  console.log(`✔ Banco "${dbName}" pronto (tabelas: users, carbon_records).`);
} catch (err) {
  console.error("Falha na migração:", err.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
