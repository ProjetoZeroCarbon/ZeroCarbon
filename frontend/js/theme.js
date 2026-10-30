/* ============================================================
   ZeroCarbon — theme.js
   Alternância entre tema claro e escuro, com persistência local.
   ============================================================ */

const THEME_KEY = "zerocarbon_theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(saved);

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  });
}

document.addEventListener("DOMContentLoaded", initTheme);
