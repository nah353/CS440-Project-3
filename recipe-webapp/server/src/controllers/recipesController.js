/**
 * Recipes Controller - Presentation Layer
 * Handles HTTP request/response for recipes
 */
import { RecipeService } from "../services/recipeService.js";

export function listRecipesHandler(req, res) {
  try {
    const q = req.query.q || "";
    const recipes = RecipeService.listRecipes(q);
    res.json(recipes);
  } catch (error) {
    console.error("Error in listRecipesHandler:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export function getRecipeHandler(req, res) {
  try {
    const id = Number(req.params.id);
    const recipe = RecipeService.getRecipeById(id);
    res.json(recipe);
  } catch (error) {
    console.error("Error in getRecipeHandler:", error.message);
    if (error.message === "Recipe not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

export function createRecipeHandler(req, res) {
  try {
    if (!req.user?.username) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { title, description, ingredients, instructions, image } = req.body;

    console.log("Creating recipe with:", {
      title,
      description,
      ingredients: ingredients?.length || 0,
      instructions: instructions?.length || 0,
      image: image ? "base64" : null
    });

    const newRecipe = RecipeService.createRecipe(
      { title, description, ingredients, instructions, image },
      req.user.username
    );

    console.log("Recipe created successfully:", newRecipe.id, newRecipe.title);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error in createRecipeHandler:", error.message);
    res.status(400).json({ error: error.message });
  }
}

export function updateRecipeHandler(req, res) {
  try {
    if (!req.user?.username) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const id = Number(req.params.id);
    const { title, description, ingredients, instructions, image } = req.body;

    console.log("Updating recipe:", id, "with:", {
      title,
      description,
      ingredients: ingredients?.length || 0,
      instructions: instructions?.length || 0,
      image: image ? "base64" : null
    });

    const updatedRecipe = RecipeService.updateRecipe(
      id,
      { title, description, ingredients, instructions, image },
      req.user
    );

    console.log("Recipe updated successfully:", updatedRecipe.id, updatedRecipe.title);
    res.json(updatedRecipe);
  } catch (error) {
    console.error("Error in updateRecipeHandler:", error.message);
    if (
      error.message === "Recipe not found" ||
      error.message === "Only the creator can edit this recipe"
    ) {
      return res.status(error.message === "Recipe not found" ? 404 : 403).json({
        error: error.message
      });
    }
    res.status(400).json({ error: error.message });
  }
}

export function deleteRecipeHandler(req, res) {
  try {
    if (!req.user?.username) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const id = Number(req.params.id);

    RecipeService.deleteRecipe(id, req.user);

    res.json({ message: "Recipe deleted successfully", id });
  } catch (error) {
    console.error("Error in deleteRecipeHandler:", error.message);
    if (error.message === "Recipe not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "Only the creator can delete this recipe") {
      return res.status(403).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
}
