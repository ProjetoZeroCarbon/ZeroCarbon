/* ============================================================
   ZeroCarbon — api.js
   Camada única de comunicação com o backend (Node.js + Express)
   e controle da sessão (token JWT guardado no navegador).
   ============================================================ */

// Local (localhost/127.0.0.1) usa a API local; publicado usa a API na Vercel.
// TROQUE a URL abaixo pelo endereço da sua API na Vercel (termina em /api).
const PRODUCTION_API_URL = "https://zero-carbon-2.vercel.app/api";
const IS_LOCAL = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE_URL =
  window.ZEROCARBON_API_URL || (IS_LOCAL ? "http://localhost:3000/api" : PRODUCTION_API_URL);

const TOKEN_KEY = "zerocarbon_token";
/** Cópia local do nome/foto mostrados na barra lateral (ver sidebar-user.js). */
export const SIDEBAR_CACHE_KEY = "zerocarbon_sidebar_user";

/** URLs das páginas, calculadas a partir deste arquivo (funcionam em qualquer pasta/base do site). */
export const Pages = {
  login: new URL("../login.html", import.meta.url).href,
  dashboard: new URL("../dashboard.html", import.meta.url).href,
};

/** Lê a data de expiração (claim "exp", em segundos) do JWT, sem validar assinatura. */
function readTokenExpiry(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export const Session = {
  getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  setToken(token) { localStorage.setItem(TOKEN_KEY, token); },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(SIDEBAR_CACHE_KEY); // não deixa a foto de quem saiu no navegador
    } catch { /* ignora */ }
  },
  /** true só se existe token E ele ainda não expirou (token expirado é descartado). */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    const exp = readTokenExpiry(token);
    // Sem validade legível (token corrompido) ou já vencido: descarta a sessão.
    if (!exp || exp * 1000 <= Date.now()) {
      this.clear();
      return false;
    }
    return true;
  },
};

/**
 * Wrapper de fetch com tratamento de erro padronizado e
 * injeção automática do token JWT quando existir.
 */
export async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && Session.getToken()) {
    headers.Authorization = `Bearer ${Session.getToken()}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new Error("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || `Erro ${response.status} ao comunicar com o servidor.`;
    // Sessão recusada pelo servidor (token inválido/expirado): volta para o login.
    if (response.status === 401 && auth) {
      Session.clear();
      window.location.replace(Pages.login);
    }
    throw new Error(message);
  }

  return data;
}

export const Api = {
  auth: {
    login: (usernameOrEmail, password) =>
      apiRequest("/auth/login", { method: "POST", body: { usernameOrEmail, password }, auth: false }),
    register: (payload) =>
      apiRequest("/auth/register", { method: "POST", body: payload, auth: false }),
  },
  profile: {
    get: () => apiRequest("/profile"),
    update: (payload) => apiRequest("/profile", { method: "PUT", body: payload }),
    setAvatar: (image) => apiRequest("/profile/avatar", { method: "PUT", body: { image } }),
    removeAvatar: () => apiRequest("/profile/avatar", { method: "DELETE" }),
  },
  calculator: {
    calculate: (payload) => apiRequest("/calculator", { method: "POST", body: payload }),
  },
  dashboard: {
    summary: () => apiRequest("/history/summary"),
  },
  history: {
    list: () => apiRequest("/history"),
  },
};
