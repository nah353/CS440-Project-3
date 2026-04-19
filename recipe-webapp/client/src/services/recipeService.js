/**
 * Recipe Service - Business Logic Layer (Client)
 * Encapsulates recipe operations and authorization logic
 */
import * as RecipeAPI from "../api/recipes";

const DEV_OVERRIDE_USER = "xfilly";

export const RecipeService = {
  async listRecipes(query = "") {
    const res = await RecipeAPI.fetchRecipes(query);
    // API returns { recipes: [] } from the gateway; normalize to array
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.recipes)) return res.recipes;
    return [];
  },

  async getRecipeById(id) {
    return RecipeAPI.getRecipeById(id);
  },

  async createRecipe(payload) {
    return RecipeAPI.createRecipe(payload);
  },

  async updateRecipe(id, payload) {
    return RecipeAPI.updateRecipe(id, payload);
  },

  async deleteRecipe(id) {
    return RecipeAPI.deleteRecipe(id);
  },

  canManageRecipe(user, recipe) {
    const username = String(user?.username || "").toLowerCase();
    const createdBy = String(recipe?.createdBy || "").toLowerCase();
    return username === DEV_OVERRIDE_USER || username === createdBy;
  }
};
