import { HttpError } from "./httpError.js";

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/** "DD/MM/AAAA" (ou "AAAA-MM-DD") -> "AAAA-MM-DD". Vazio -> null. */
export function parseBirthDate(input) {
  if (input === undefined || input === null || String(input).trim() === "") return null;
  const raw = String(input).trim();

  let y, m, d;
  let match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) [, d, m, y] = match;
  else if ((match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/))) [, y, m, d] = match;
  else throw new HttpError(400, "Data de nascimento inválida. Use DD/MM/AAAA.");

  const date = new Date(Date.UTC(+y, +m - 1, +d));
  const valid =
    date.getUTCFullYear() === +y && date.getUTCMonth() === +m - 1 && date.getUTCDate() === +d;
  if (!valid || date > new Date() || +y < 1900) {
    throw new HttpError(400, "Data de nascimento inválida.");
  }
  return `${y}-${m}-${d}`;
}

/** Primeiro dia do mês atual ("AAAA-MM-01") no fuso informado. */
export function currentPeriodMonth(timeZone) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone }); // AAAA-MM-DD
  return `${today.slice(0, 7)}-01`;
}

/** "2026-10-01" -> "Outubro 2026" */
export function monthLabel(periodMonth) {
  const [year, month] = periodMonth.split("-");
  return `${MONTHS_PT[Number(month) - 1]} ${year}`;
}

/** Segundos desde 1970 (UNIX_TIMESTAMP do MySQL) -> "30 de outubro de 2026 às 19:37" no fuso informado. */
export function formatDateTime(unixSeconds, timeZone) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(unixSeconds * 1000));
}
