/* ============================================================
   ZeroCarbon — sidebar-user.js
   Preenche o bloco "Minha conta" (canto inferior esquerdo da barra
   lateral) com o nome e a foto de perfil do usuário logado.

   Para a foto não "piscar" a cada troca de página, o último nome/foto
   fica guardado no navegador (localStorage) e é mostrado na hora;
   em seguida os dados são atualizados pela API.
   ============================================================ */

import { Api, SIDEBAR_CACHE_KEY } from "./api.js";

const fullName = (user) =>
  `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;

function readCache() {
  try { return JSON.parse(localStorage.getItem(SIDEBAR_CACHE_KEY)); } catch { return null; }
}

function writeCache(data) {
  try { localStorage.setItem(SIDEBAR_CACHE_KEY, JSON.stringify(data)); } catch { /* sem espaço: ignora */ }
}

/** Pinta nome e foto em todos os blocos .side-user da página. */
function render({ name, avatarUrl }) {
  document.querySelectorAll(".side-user").forEach((box) => {
    const nameEl = box.querySelector("[data-profile-name]");
    if (nameEl && name) nameEl.textContent = name;

    const avatarEl = box.querySelector(".avatar");
    if (avatarEl) avatarEl.style.backgroundImage = avatarUrl ? `url("${avatarUrl}")` : "";
  });
}

/** Guarda e exibe os dados vindos de GET/PUT /profile. */
export function syncSidebarUser(user) {
  const data = { name: fullName(user), avatarUrl: user.avatarUrl || null };
  writeCache(data);
  render(data);
}

/** Atualiza só a foto (usado pela página de perfil ao trocar/remover). */
export function updateSidebarAvatar(avatarUrl) {
  const data = { ...(readCache() || {}), avatarUrl: avatarUrl || null };
  writeCache(data);
  render(data);
}

export async function initSidebarUser() {
  if (!document.querySelector(".side-user")) return;

  const cached = readCache();
  if (cached) render(cached);

  try {
    syncSidebarUser(await Api.profile.get());
  } catch (err) {
    console.warn("Não foi possível carregar o perfil da barra lateral:", err.message);
  }
}
