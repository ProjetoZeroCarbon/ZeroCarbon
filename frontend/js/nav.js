/* ============================================================
   ZeroCarbon — nav.js
   Comportamentos de navegação comuns às páginas internas (app shell):
   marca o link ativo, cuida do botão de logout e protege rotas privadas.
   ============================================================ */

import { Session, Pages } from "./api.js";
import { initSidebarUser } from "./sidebar-user.js";

export function guardPrivatePage() {
  if (!Session.isAuthenticated()) {
    window.location.replace(Pages.login);
    return false;
  }
  return true;
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
      window.location.replace(Pages.login);
    });
  });
}

// Este script só é carregado em páginas internas, então todas são privadas.
guardPrivatePage();

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initSidebarUser(); // nome + foto no bloco "Minha conta" (só age se a página tiver esse bloco)
});

// Voltar pelo histórico do navegador após o logout restaura a página do cache:
// revalida a sessão nesse caso.
window.addEventListener("pageshow", (event) => {
  if (event.persisted) guardPrivatePage();
});
