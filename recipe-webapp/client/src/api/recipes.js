import { apiGet, apiPost, apiPut, apiDelete } from "./client";

export function fetchRecipes(q = "") {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiGet(`/recipes${qs}`);
}

export function getRecipeById(id) {
  return apiGet(`/recipes/${id}`);
}

export function createRecipe(payload) {
  return apiPost("/recipes", payload);
}

export function updateRecipe(id, payload) {
  return apiPut(`/recipes/${id}`, payload);
}

export function deleteRecipe(id) {
  return apiDelete(`/recipes/${id}`);
}
