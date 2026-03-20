import { listRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from "../db.js";

const DEV_OVERRIDE_USER = "xfilly";

function canManageRecipe(user, recipe) {
  const username = String(user?.username || "").toLowerCase();
  const createdBy = String(recipe?.createdBy || "").toLowerCase();
  return username === DEV_OVERRIDE_USER || username === createdBy;
}

export function listRecipesHandler(req, res) {
  const q = req.query.q || "";
  const recipes = listRecipes({ q });
  res.json(recipes);
}

export function getRecipeHandler(req, res) {
  const id = Number(req.params.id);
  const recipe = getRecipeById(id);
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json(recipe);
}

export function createRecipeHandler(req, res) {
  try {
    if (!req.user?.username) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { title, description, ingredients, instructions, image } = req.body;

    console.log("Creating recipe with:", { title, description, ingredients: ingredients?.length || 0, instructions: instructions?.length || 0, image: image ? "base64" : null });

    // Validate required fields
    if (!title || !instructions) {
      return res.status(400).json({ error: "title and instructions are required" });
    }

    // Validate lengths
    if (title && String(title).trim().length > 30) {
      return res.status(400).json({ error: "title must be 30 characters or fewer" });
    }

    if (description && String(description).trim().length > 120) {
      return res.status(400).json({ error: "description must be 120 characters or fewer" });
    }

    // Validate ingredients
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "ingredients must be an array" });
    }

    // Validate image if provided
    if (image && typeof image !== 'string') {
      return res.status(400).json({ error: "image must be a base64 string" });
    }

    // Check image size (max 5MB for base64)
    if (image && image.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "image is too large. Max 5MB." });
    }

    const newRecipe = createRecipe({
      title: title.trim(),
      description: description ? description.trim() : "",
      ingredients: ingredients.map(ing => typeof ing === 'string' ? ing.trim() : ing).filter(ing => ing),
      instructions: instructions.trim(),
      image: image || null,
      createdBy: req.user.username
    });

    console.log("Recipe created successfully:", newRecipe.id, newRecipe.title);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error in createRecipeHandler:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ error: "Failed to create recipe", details: error.message });
  }
}

export function updateRecipeHandler(req, res) {
  try {
    if (!req.user?.username) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const id = Number(req.params.id);
    const { title, description, ingredients, instructions, image } = req.body;

    console.log("Updating recipe:", id, "with:", { title, description, ingredients: ingredients?.length || 0, instructions: instructions?.length || 0, image: image ? "base64" : null });

    const recipe = getRecipeById(id);
    if (!recipe) {
      console.warn("Recipe not found:", id);
      return res.status(404).json({ error: "Recipe not found" });
    }

    if (!canManageRecipe(req.user, recipe)) {
      return res.status(403).json({ error: "Only the creator can edit this recipe" });
    }

    // Validate required fields
    if (!title || !instructions) {
      return res.status(400).json({ error: "title and instructions are required" });
    }

    // Validate lengths
    if (title && String(title).trim().length > 30) {
      return res.status(400).json({ error: "title must be 30 characters or fewer" });
    }

    if (description && String(description).trim().length > 120) {
      return res.status(400).json({ error: "description must be 120 characters or fewer" });
    }

    // Validate ingredients
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "ingredients must be an array" });
    }

    // Validate image if provided
    if (image && typeof image !== 'string') {
      return res.status(400).json({ error: "image must be a base64 string" });
    }

    // Check image size (max 5MB for base64)
    if (image && image.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "image is too large. Max 5MB." });
    }

    const updatedRecipe = updateRecipe(id, {
      title: title.trim(),
      description: description ? description.trim() : recipe.description,
      ingredients: ingredients.map(ing => typeof ing === 'string' ? ing.trim() : ing).filter(ing => ing),
      instructions: instructions.trim(),
      image: image !== undefined ? image : recipe.image
    });

    console.log("Recipe updated successfully:", updatedRecipe.id, updatedRecipe.title);
    res.json(updatedRecipe);
  } catch (error) {
    console.error("Error in updateRecipeHandler:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ error: "Failed to update recipe", details: error.message });
  }
}

export function deleteRecipeHandler(req, res) {
  if (!req.user?.username) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const id = Number(req.params.id);
  const recipe = getRecipeById(id);
  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  if (!canManageRecipe(req.user, recipe)) {
    return res.status(403).json({ error: "Only the creator can delete this recipe" });
  }

  const deleted = deleteRecipe(id);
  
  if (!deleted) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  res.json({ message: "Recipe deleted successfully", id });
}
