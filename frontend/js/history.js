/* ============================================================
   ZeroCarbon — history.js
   Busca o histórico mensal de cálculos do usuário no backend.
   ============================================================ */

import { Api } from "./api.js";

function renderList(records) {
  const list = document.getElementById("histList");
  if (!list) return;

  if (!records.length) {
    list.innerHTML = `<p style="padding:16px 0;">Nenhum cálculo registrado ainda. Use a calculadora para começar.</p>`;
    return;
  }

  list.innerHTML = records.map((r) => `
    <div class="hist-row">
      <div class="m">
        <div class="n">${r.monthLabel}</div>
        <div class="d">${r.totalTco2.toFixed(2)} tCO₂</div>
      </div>
      <span class="badge ${r.deltaPct <= 0 ? "down" : "up"}">${r.deltaPct > 0 ? "+" : ""}${r.deltaPct}%</span>
    </div>
  `).join("");
}

async function loadHistory() {
  try {
    const records = await Api.history.list();
    renderList(records);
  } catch (err) {
    console.warn("Não foi possível carregar o histórico:", err.message);
  }
}

document.addEventListener("DOMContentLoaded", loadHistory);
