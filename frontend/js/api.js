/* ============================================================
   ZeroCarbon — api.js
   Camada única de comunicação com o backend (Node.js + Express).
   Todos os outros módulos JS usam este arquivo para falar com a API.
   ============================================================ */

const API_BASE_URL = window.ZEROCARBON_API_URL || "http://localhost:3000/api";

const TOKEN_KEY = "zerocarbon_token";

export const Session = {
  getToken(){ return localStorage.getItem(TOKEN_KEY); },
  setToken(token){ localStorage.setItem(TOKEN_KEY, token); },
  clear(){ localStorage.removeItem(TOKEN_KEY); },
  isAuthenticated(){ return !!this.getToken(); },
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
    if (response.status === 401) Session.clear();
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
