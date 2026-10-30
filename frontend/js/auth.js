/* ============================================================
   ZeroCarbon — auth.js
   Lógica das páginas de login e cadastro.
   Quem já está logado é enviado direto ao painel.
   ============================================================ */

import { Api, Session, Pages } from "./api.js";

function redirectIfLoggedIn() {
  if (Session.isAuthenticated()) window.location.replace(Pages.dashboard);
}

// Roda já ao carregar (antes de mostrar o formulário) e ao voltar pelo histórico.
redirectIfLoggedIn();
window.addEventListener("pageshow", (event) => {
  if (event.persisted) redirectIfLoggedIn();
});

function showError(form, message) {
  const box = form.querySelector(".form-error");
  if (!box) return;
  box.textContent = message;
  box.classList.add("visible");
}

function clearError(form) {
  const box = form.querySelector(".form-error");
  if (box) box.classList.remove("visible");
}

function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError(form);

    const usernameOrEmail = document.getElementById("l-user").value.trim();
    const password = document.getElementById("l-pass").value;

    if (!usernameOrEmail || !password) {
      showError(form, "Preencha usuário e senha.");
      return;
    }

    try {
      const { token } = await Api.auth.login(usernameOrEmail, password);
      Session.setToken(token);
      window.location.replace(Pages.dashboard);
    } catch (err) {
      showError(form, err.message);
    }
  });
}

function initSignupForm() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError(form);

    const payload = {
      firstName: document.getElementById("s-nome").value.trim(),
      lastName: document.getElementById("s-sobrenome").value.trim(),
      birthDate: document.getElementById("s-nasc").value.trim(),
      location: document.getElementById("s-estado").value.trim(),
      email: document.getElementById("s-email").value.trim(),
      password: document.getElementById("s-senha").value,
      username: document.getElementById("s-id").value.trim(),
    };

    if (!payload.email || !payload.password || !payload.username) {
      showError(form, "E-mail, senha e ID de usuário são obrigatórios.");
      return;
    }
    if (payload.password.length < 8) {
      showError(form, "A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    try {
      const { token } = await Api.auth.register(payload);
      Session.setToken(token);
      window.location.replace(Pages.dashboard);
    } catch (err) {
      showError(form, err.message);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initSignupForm();
});
