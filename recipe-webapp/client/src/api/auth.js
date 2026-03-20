import { apiGet, apiPost } from "./client";

export function registerUser(payload) {
  return apiPost("/auth/register", payload);
}

export function loginUser(payload) {
  return apiPost("/auth/login", payload);
}

export function getCurrentUser() {
  return apiGet("/auth/me");
}

export function logoutUser() {
  return apiPost("/auth/logout", {});
}
