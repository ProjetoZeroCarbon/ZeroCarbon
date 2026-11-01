import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import { calculateFootprint } from "../utils/emissions.js";
import { currentPeriodMonth } from "../utils/dates.js";

export async function calculate(req, res) {
  const result = calculateFootprint(req.body ?? {});
  const { kwh, gas, km, factor } = result.inputs;

  // Cada cálculo vira uma nova linha no histórico.
  await pool.execute(
    `INSERT INTO carbon_records
       (user_id, period_month, electricity_kwh, gas_m3, distance_km, fuel_factor,
        electricity_tco2, gas_tco2, transport_tco2, total_tco2)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.userId, currentPeriodMonth(env.timezone), kwh, gas, km, factor,
      result.electricityTco2, result.gasTco2, result.transportTco2, result.totalTco2,
    ]
  );

  res.json({
    totalTco2: result.totalTco2,
    electricityTco2: result.electricityTco2,
    gasTco2: result.gasTco2,
    transportTco2: result.transportTco2,
    comparisonText: result.comparisonText,
  });
}
