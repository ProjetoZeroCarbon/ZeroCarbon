/* ============================================================
   ZeroCarbon — profile.js
   Carrega e atualiza os dados de perfil do usuário logado,
   incluindo a foto de perfil (salva no banco, por usuário).
   ============================================================ */

import { Api } from "./api.js";

const AVATAR_SIZE = 256;            // a foto é recortada em quadrado e reduzida a 256x256
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ---------- renderização ---------- */

function renderAvatar(avatarUrl) {
  const preview = document.getElementById("avatarPreview");
  const removeBtn = document.getElementById("avatarRemove");
  if (preview) {
    preview.style.backgroundImage = avatarUrl ? `url("${avatarUrl}")` : "";
  }
  if (removeBtn) removeBtn.style.display = avatarUrl ? "" : "none";
}

function renderProfile(user) {
  document
    .querySelectorAll("[data-profile-name]")
    .forEach((el) => (el.textContent = `${user.firstName} ${user.lastName}`.trim() || user.username));

  const locEl = document.querySelector("[data-profile-location]");
  if (locEl) locEl.textContent = `${user.username} · ${user.location || "não informado"}`;

  // Campos de formulário usam .value (textContent não funciona em <input>)
  const emailInput = document.getElementById("p-email");
  if (emailInput) emailInput.value = user.email || "";
  const locationInput = document.getElementById("p-location");
  if (locationInput) locationInput.value = user.location || "";

  renderAvatar(user.avatarUrl);
}

async function loadProfile() {
  try {
    renderProfile(await Api.profile.get());
  } catch (err) {
    console.warn("Não foi possível carregar o perfil:", err.message);
  }
}

/* ---------- formulário de conta ---------- */

function initEditableFields() {
  const form = document.getElementById("profileForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const user = await Api.profile.update(Object.fromEntries(new FormData(form)));
      renderProfile(user);
      alert("Perfil atualizado com sucesso.");
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ---------- foto de perfil ---------- */

function setAvatarMessage(text, isError = false) {
  const msg = document.getElementById("avatarMsg");
  if (!msg) return;
  msg.textContent = text;
  msg.classList.toggle("error", isError);
}

/** Recorta o centro da imagem em quadrado e reduz para 256x256 JPEG (poucos KB). */
function fileToAvatarDataUrl(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_SIZE;
      canvas.height = AVATAR_SIZE;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"; // JPEG não tem transparência
      ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
      ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível ler essa imagem."));
    };
    img.src = objectUrl;
  });
}

function initAvatar() {
  const changeBtn = document.getElementById("avatarChange");
  if (!changeBtn) {
    console.warn("[foto] Botão #avatarChange não encontrado no profile.html.");
    return;
  }

  // Se o <input type="file"> não estiver no HTML, cria um aqui.
  let input = document.getElementById("avatarInput");
  if (!input) {
    input = document.createElement("input");
    input.type = "file";
    input.id = "avatarInput";
    input.accept = "image/png,image/jpeg,image/webp";
    input.hidden = true;
    changeBtn.after(input);
  }
  const removeBtn = document.getElementById("avatarRemove");

  changeBtn.addEventListener("click", () => input.click());

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = ""; // permite escolher o mesmo arquivo de novo depois
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setAvatarMessage("Use uma imagem JPG, PNG ou WebP.", true);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setAvatarMessage("A imagem é grande demais (máx. 8 MB).", true);
      return;
    }

    changeBtn.disabled = true;
    setAvatarMessage("Enviando foto...");
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      const { avatarUrl } = await Api.profile.setAvatar(dataUrl);
      renderAvatar(avatarUrl);
      setAvatarMessage("Foto atualizada.");
    } catch (err) {
      setAvatarMessage(err.message, true);
    } finally {
      changeBtn.disabled = false;
    }
  });

  removeBtn?.addEventListener("click", async () => {
    try {
      await Api.profile.removeAvatar();
      renderAvatar(null);
      setAvatarMessage("Foto removida.");
    } catch (err) {
      setAvatarMessage(err.message, true);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  initEditableFields();
  initAvatar();
});
