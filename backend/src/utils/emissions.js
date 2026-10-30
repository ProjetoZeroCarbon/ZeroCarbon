import { HttpError } from "./httpError.js";

// Fatores de emissão (mesmos do protótipo original em scripts.js)
export const FACTORS = {
  electricityKgPerKwh: 0.0817,
  gasKgPerM3: 2.02,
};

// Combustíveis aceitos (kg CO₂ por km): gasolina, álcool, diesel.
// O backend valida o valor para não confiar cegamente no cliente.
export const FUEL_FACTORS = [0.192, 0.03, 0.212];

const MAX_INPUT = 1_000_000;
const round4 = (n) => Math.round(n * 10_000) / 10_000;

function toNonNegative(value, label) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > MAX_INPUT) {
    throw new HttpError(400, `Valor inválido em "${label}". Informe um número entre 0 e ${MAX_INPUT}.`);
  }
  return n;
}

export function calculateFootprint({ electricityKwh, gasM3, distanceKm, fuelFactor }) {
  const kwh = toNonNegative(electricityKwh, "energia elétrica");
  const gas = toNonNegative(gasM3, "gás");
  const km = toNonNegative(distanceKm, "distância");
  const factor = Number(fuelFactor);

  if (!FUEL_FACTORS.some((f) => Math.abs(f - factor) < 1e-9)) {
    throw new HttpError(400, "Tipo de combustível inválido.");
  }

  const electricityTco2 = round4((kwh * FACTORS.electricityKgPerKwh) / 1000);
  const gasTco2 = round4((gas * FACTORS.gasKgPerM3) / 1000);
  const transportTco2 = round4((km * factor) / 1000);
  const totalTco2 = round4(electricityTco2 + gasTco2 + transportTco2);

  const tanksPerYear = Math.round((totalTco2 * 12) / 0.65);
  const comparisonText = `Isso equivale a cerca de ${tanksPerYear} tanques de gás de cozinha por ano.`;

  return {
    inputs: { kwh, gas, km, factor },
    electricityTco2,
    gasTco2,
    transportTco2,
    totalTco2,
    comparisonText,
  };
}
