/* ============================================================
   ZeroCarbon — landing.js
   Na página inicial, quem já está logado não vê "Entrar / Criar conta":
   os botões viram um atalho para o painel.
   ============================================================ */

import { Session, Pages } from "./api.js";

function showDashboardShortcut() {
  const links = document.querySelectorAll('a[href$="login.html"], a[href$="signup.html"]');

  links.forEach((link) => {
    const isLogin = link.getAttribute("href").endsWith("login.html");
    const counterpart = link.parentElement?.querySelector(
      isLogin ? 'a[href$="signup.html"]' : 'a[href$="login.html"]'
    );

    // Quando os dois botões estão lado a lado, mantém só um (o de "criar conta", que é o principal).
    if (isLogin && counterpart) {
      link.remove();
      return;
    }
    link.href = Pages.dashboard;
    link.textContent = "Ir para o painel";
  });
}

function update() {
  if (Session.isAuthenticated()) showDashboardShortcut();
}

document.addEventListener("DOMContentLoaded", update);
// Voltar do painel pelo histórico (página restaurada do cache) também atualiza os botões.
window.addEventListener("pageshow", (event) => {
  if (event.persisted) update();
});
