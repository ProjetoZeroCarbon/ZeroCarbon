/* ============================================================
   ZeroCarbon — sidebar-user.js
   Preenche o bloco "Minha conta" (canto inferior esquerdo da barra
   lateral) com o nome e a foto de perfil do usuário logado.

   Para a foto não "piscar" a cada troca de página, o último nome/foto
   fica guardado no navegador (localStorage) e é mostrado na hora;
   em seguida os dados são atualizados pela API.
   ============================================================ */

import { Api, SIDEBAR_CACHE_KEY } from "./api.js";

const PROFILE_URL = new URL("../profile.html", import.meta.url).href;

// Estilo do bloco injetado pelo próprio script: não depende de editar o app.css.
const STYLE_ID = "sidebar-user-style";
const STYLE_CSS = `
.side-user .avatar{ flex-shrink:0; background-size:cover; background-position:center; }
a.side-user{
  color:inherit; text-decoration:none; cursor:pointer;
  padding:8px 10px; margin:0 -10px; border-radius:var(--radius-sm, 12px);
  transition:background .15s ease;
}
a.side-user:hover{ background:var(--surface-alt, rgba(0,0,0,.05)); }
a.side-user:focus-visible{ outline:2px solid var(--accent, #2f9e67); outline-offset:2px; }
.side-user > div:last-child{ min-width:0; }
.side-user .who{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
`;

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLE_CSS;
  document.head.appendChild(style);
}

/** Garante que cada .side-user seja um link <a> para o perfil (mesmo que o HTML ainda seja um <div>). */
function ensureProfileLinks() {
  document.querySelectorAll(".side-user").forEach((box) => {
    if (box.tagName === "A") {
      if (!box.getAttribute("href")) box.setAttribute("href", PROFILE_URL);
      return;
    }
    const link = document.createElement("a");
    link.className = box.className;
    link.href = PROFILE_URL;
    link.title = "Ver meu perfil";
    while (box.firstChild) link.appendChild(box.firstChild);
    box.replaceWith(link);
  });
}

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
    if (avatarEl) {
      avatarEl.style.backgroundImage = avatarUrl ? `url("${avatarUrl}")` : "";
      avatarEl.style.backgroundSize = "cover";
      avatarEl.style.backgroundPosition = "center";
    }
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

  injectStyles();
  ensureProfileLinks();

  const cached = readCache();
  if (cached) render(cached);

  try {
    syncSidebarUser(await Api.profile.get());
  } catch (err) {
    console.warn("Não foi possível carregar o perfil da barra lateral:", err.message);
  }
}
