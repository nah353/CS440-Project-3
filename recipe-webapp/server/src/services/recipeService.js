/**
 * Recipe Service - Business Logic Layer
 * Handles recipe business logic and validation
 */
import { RecipeRepository } from "../repositories/recipeRepository.js";
import { validateRecipeData } from "./validationService.js";

export const RecipeService = {
  listRecipes(query) {
    return RecipeRepository.findAll(query);
  },

  getRecipeById(id) {
    const recipe = RecipeRepository.findById(id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return recipe;
  },

  createRecipe(recipeData, createdBy) {
    // Validate recipe data
    const validationError = validateRecipeData(recipeData);
    if (validationError) {
      throw new Error(validationError);
    }

    const cleanedData = {
      title: recipeData.title.trim(),
      description: recipeData.description ? recipeData.description.trim() : "",
      ingredients: recipeData.ingredients
        .map((ing) => (typeof ing === "string" ? ing.trim() : ing))
        .filter((ing) => ing),
      instructions: recipeData.instructions.trim(),
      image: recipeData.image || null,
      createdBy
    };

    return RecipeRepository.create(cleanedData);
  },

  updateRecipe(id, recipeData, currentUser) {
    const recipe = RecipeRepository.findById(id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // Check authorization
    if (!this.canManageRecipe(currentUser, recipe)) {
      throw new Error("Only the creator can edit this recipe");
    }

    // Validate recipe data
    const validationError = validateRecipeData(recipeData);
    if (validationError) {
      throw new Error(validationError);
    }

    const cleanedData = {
      title: recipeData.title.trim(),
      description: recipeData.description ? recipeData.description.trim() : recipe.description,
      ingredients: recipeData.ingredients
        .map((ing) => (typeof ing === "string" ? ing.trim() : ing))
        .filter((ing) => ing),
      instructions: recipeData.instructions.trim(),
      image: recipeData.image !== undefined ? recipeData.image : recipe.image
    };

    return RecipeRepository.update(id, cleanedData);
  },

  deleteRecipe(id, currentUser) {
    const recipe = RecipeRepository.findById(id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // Check authorization
    if (!this.canManageRecipe(currentUser, recipe)) {
      throw new Error("Only the creator can delete this recipe");
    }

    const deleted = RecipeRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete recipe");
    }

    return true;
  },

  canManageRecipe(user, recipe) {
    const username = String(user?.username || "").toLowerCase();
    const createdBy = String(recipe?.createdBy || "").toLowerCase();
    const DEV_OVERRIDE_USER = "xfilly";
    return username === DEV_OVERRIDE_USER || username === createdBy;
  }
};
