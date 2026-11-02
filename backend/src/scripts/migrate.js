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
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

try {
  // Em bancos hospedados o banco já existe e o usuário pode não ter permissão
  // de CREATE DATABASE: nesse caso seguimos em frente e usamos o banco existente.
  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } catch (err) {
    console.warn(`Aviso: não foi possível criar o banco (${err.message}). Usando o banco existente "${dbName}".`);
  }
  await conn.query(`USE \`${dbName}\``);
  await conn.query(await fs.readFile(schemaPath, "utf8"));

  // Bancos criados na versão antiga tinham UNIQUE(user_id, period_month), que limitava
  // o histórico a um cálculo por mês. Troca por um índice comum (mantém os dados).
  const [legacy] = await conn.query(
    `SELECT 1 FROM information_schema.statistics
     WHERE table_schema = ? AND table_name = 'carbon_records' AND index_name = 'uq_records_user_period'
     LIMIT 1`,
    [dbName]
  );
  if (legacy.length) {
    await conn.query(
      `ALTER TABLE carbon_records
         ADD INDEX idx_records_user_period (user_id, period_month),
         DROP INDEX uq_records_user_period`
    );
    console.log("✔ Histórico atualizado: agora cada cálculo é salvo (antes: 1 por mês).");
  }

  console.log(`✔ Banco "${dbName}" pronto (tabelas: users, carbon_records, user_avatars).`);
} catch (err) {
  console.error("Falha na migração:", err.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
