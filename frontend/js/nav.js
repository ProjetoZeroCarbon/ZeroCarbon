/* ============================================================
   ZeroCarbon — nav.js
   Comportamentos de navegação comuns às páginas internas (app shell):
   marca o link ativo, cuida do botão de logout e protege rotas privadas.
   ============================================================ */

import { Session } from "./api.js";

const PUBLIC_PAGES = ["index.html", "login.html", "signup.html", ""];

export function guardPrivatePage() {
  const page = window.location.pathname.split("/").pop();
  if (!PUBLIC_PAGES.includes(page) && !Session.isAuthenticated()) {
    window.location.href = "login.html";
  }
}

export function initNav() {
  const current = window.location.pathname.split("/").pop();
  document.querySelectorAll(".side-link").forEach((link) => {
    const target = link.getAttribute("href");
    link.classList.toggle("active", target === current);
  });

  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      Session.clear();
      window.location.href = "login.html";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  guardPrivatePage();
  initNav();
});
