import { env } from "./config/env.js";
import { pool } from "./config/db.js";
import app from "./app.js";

try {
  await pool.query("SELECT 1");
  console.log(`✔ MySQL conectado (${env.db.host}:${env.db.port}/${env.db.name})`);
} catch (err) {
  console.error("✖ Não foi possível conectar ao MySQL:", err.message);
  console.error("  Confira o .env e rode `npm run db:migrate` se o banco ainda não existe.");
  process.exit(1);
}

const server = app.listen(env.port, () => {
  console.log(`ZeroCarbon API em http://localhost:${env.port}/api`);
});

async function shutdown() {
  server.close();
  await pool.end();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
