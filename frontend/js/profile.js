/* ============================================================
   ZeroCarbon — profile.js
   Carrega e atualiza os dados de perfil do usuário logado.
   ============================================================ */

import { Api } from "./api.js";

function renderProfile(user) {
  const nameEls = document.querySelectorAll("[data-profile-name]");
  nameEls.forEach((el) => (el.textContent = `${user.firstName} ${user.lastName}`.trim()));

  const locEl = document.querySelector("[data-profile-location]");
  if (locEl) locEl.textContent = `${user.username} · ${user.location || "não informado"}`;

  const emailEl = document.querySelector("[data-profile-email]");
  if (emailEl) emailEl.textContent = user.email;
}

async function loadProfile() {
  try {
    const user = await Api.profile.get();
    renderProfile(user);
  } catch (err) {
    console.warn("Não foi possível carregar o perfil:", err.message);
  }
}

function initEditableFields() {
  const form = document.getElementById("profileForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    try {
      const user = await Api.profile.update(Object.fromEntries(formData));
      renderProfile(user);
      alert("Perfil atualizado com sucesso.");
    } catch (err) {
      alert(err.message);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  initEditableFields();
});
