/* ============================================================
   ZeroCarbon — dashboard.js
   Busca o resumo do usuário (última pegada, categorias, evolução)
   no backend e preenche o painel.
   ============================================================ */

import { Api } from "./api.js";

function setGreeting(name) {
  const el = document.getElementById("dashboardGreeting");
  if (el) el.textContent = `Olá, ${name || "visitante"} 👋`;
}

function setDate() {
  const el = document.getElementById("dashboardDate");
  if (!el) return;
  const formatted = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long",
  });
  el.textContent = formatted;
}

function renderSummary(summary) {
  if (!summary) return;

  const ringPct = document.getElementById("ringPct");
  if (ringPct) ringPct.textContent = `${summary.goalProgressPct}%`;

  const totalEl = document.querySelector(".hero-stat-card .num");
  if (totalEl) totalEl.innerHTML = `${summary.currentTco2.toFixed(1)} <span>tCO₂ este mês</span>`;

  const deltaEl = document.querySelector(".hero-stat-card .delta");
  if (deltaEl) {
    const arrow = summary.deltaPct <= 0 ? "↓" : "↑";
    deltaEl.textContent = `${arrow} ${Math.abs(summary.deltaPct)}% vs. mês anterior`;
  }
}

async function loadDashboard() {
  try {
    const summary = await Api.dashboard.summary();
    setGreeting(summary.firstName);
    renderSummary(summary);
  } catch (err) {
    console.warn("Não foi possível carregar o resumo do dashboard:", err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setDate();
  loadDashboard();
});
