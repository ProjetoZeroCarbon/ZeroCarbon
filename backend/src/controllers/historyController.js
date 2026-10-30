import { pool } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";
import { monthLabel } from "../utils/dates.js";

const deltaPct = (current, previous) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;

/** GET /history — mais recente primeiro; delta é relativo ao registro anterior. */
export async function list(req, res) {
  const [rows] = await pool.execute(
    `SELECT period_month, total_tco2 FROM carbon_records
     WHERE user_id = ? ORDER BY period_month ASC`,
    [req.userId]
  );

  const records = rows.map((row, i) => ({
    monthLabel: monthLabel(row.period_month),
    totalTco2: row.total_tco2,
    deltaPct: i === 0 ? 0 : deltaPct(row.total_tco2, rows[i - 1].total_tco2),
  }));

  res.json(records.reverse());
}

/** GET /history/summary — dados do dashboard. */
export async function summary(req, res) {
  const [users] = await pool.execute(
    "SELECT first_name, monthly_goal_tco2 FROM users WHERE id = ?",
    [req.userId]
  );
  if (!users[0]) throw new HttpError(404, "Usuário não encontrado.");

  const [rows] = await pool.execute(
    `SELECT period_month, total_tco2, electricity_tco2, gas_tco2, transport_tco2
     FROM carbon_records WHERE user_id = ? ORDER BY period_month DESC LIMIT 2`,
    [req.userId]
  );
  const [latest, previous] = rows;

  const goal = users[0].monthly_goal_tco2;
  const current = latest?.total_tco2 ?? 0;

  // Progresso da meta: 100% se o total está dentro da meta; senão, meta / total.
  const goalProgressPct = current > 0 ? Math.min(100, Math.round((goal / current) * 100)) : 0;

  res.json({
    firstName: users[0].first_name,
    currentTco2: current,
    deltaPct: latest && previous ? deltaPct(current, previous.total_tco2) : 0,
    goalProgressPct,
    goalTco2: goal,
    periodLabel: latest ? monthLabel(latest.period_month) : null,
    categories: latest
      ? {
          electricityTco2: latest.electricity_tco2,
          gasTco2: latest.gas_tco2,
          transportTco2: latest.transport_tco2,
        }
      : null,
  });
}
