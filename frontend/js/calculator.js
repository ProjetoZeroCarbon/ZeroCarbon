/* ============================================================
   ZeroCarbon — calculator.js
   Lógica da calculadora de pegada de carbono.
   O cálculo em si agora é feito e persistido pelo backend
   (ver backend/src/controllers/calculatorController.js),
   este módulo apenas coleta os dados do formulário e exibe o resultado.
   ============================================================ */

import { Api } from "./api.js";

function readForm() {
  const fuelFactor = document.querySelector('input[name="fuel"]:checked')?.value || "0.192";
  return {
    electricityKwh: Number(document.getElementById("c-kwh").value || 0),
    gasM3: Number(document.getElementById("c-gas").value || 0),
    distanceKm: Number(document.getElementById("c-km").value || 0),
    fuelFactor: Number(fuelFactor),
  };
}

function renderResult(result) {
  const preview = document.querySelector(".calc-preview");
  preview.style.display = "block";

  document.getElementById("calcTotal").innerHTML =
    `${result.totalTco2.toFixed(2)} <span>tCO₂/mês</span>`;
  document.getElementById("calcElet").textContent = `${result.electricityTco2.toFixed(2)} t`;
  document.getElementById("calcGas").textContent = `${result.gasTco2.toFixed(2)} t`;
  document.getElementById("calcTransp").textContent = `${result.transportTco2.toFixed(2)} t`;
  document.getElementById("calcCompare").textContent = result.comparisonText;

  preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function initFuelSelector() {
  document.querySelectorAll('input[name="fuel"]').forEach((input) => {
    input.addEventListener("change", () => {
      document.querySelectorAll(".radio-opt").forEach((label) => label.classList.remove("checked"));
      input.closest(".radio-opt")?.classList.add("checked");
    });
  });
}

function initCalculator() {
  const btn = document.getElementById("calcBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "Calculando...";
    try {
      const result = await Api.calculator.calculate(readForm());
      renderResult(result);
    } catch (err) {
      alert(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = "Calcular minha pegada";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFuelSelector();
  initCalculator();
});
