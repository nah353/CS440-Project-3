const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export const AUTH_TOKEN_KEY = "recipe_auth_token";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (!token) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function buildHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: buildHeaders()
  });
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`POST ${path} failed: ${msg}`);
  }
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    let errorMsg = `PUT ${path} failed with status ${res.status}`;
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
      if (data.details) errorMsg += `: ${data.details}`;
    } catch (e) {
      const text = await res.text();
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: buildHeaders({ "Content-Type": "application/json" })
  });

  if (!res.ok) {
    let errorMsg = `DELETE ${path} failed with status ${res.status}`;
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
      if (data.details) errorMsg += `: ${data.details}`;
    } catch (e) {
      const text = await res.text();
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}
