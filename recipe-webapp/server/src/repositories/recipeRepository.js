/**
 * Recipe Repository - Data Access Layer
 * Handles all recipe persistence operations
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Recipe } from "../models/recipe.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RECIPES_FILE = path.join(__dirname, "..", "recipes.json");

let recipes = loadRecipesFromFile();

function loadRecipesFromFile() {
  try {
    if (fs.existsSync(RECIPES_FILE)) {
      const data = fs.readFileSync(RECIPES_FILE, "utf-8");
      const parsed = JSON.parse(data);
      const normalized = Array.isArray(parsed)
        ? parsed.map((r) => Recipe.create(r))
        : [];
      console.log(`✅ Loaded ${normalized.length} recipes from file`);
      return normalized;
    }
  } catch (error) {
    console.error("Error reading recipes file:", error.message);
  }

  return [
    Recipe.create({
      id: 1,
      title: "Example Pancakes",
      description: "Fluffy starter recipe",
      ingredients: ["Flour", "Eggs", "Milk"],
      instructions: "Mix, cook, eat.",
      image: null,
      createdBy: "System"
    })
  ];
}

function saveRecipesToFile() {
  try {
    fs.writeFileSync(
      RECIPES_FILE,
      JSON.stringify(recipes.map((r) => r.toJSON()), null, 2),
      "utf-8"
    );
    console.log(`✅ Saved ${recipes.length} recipes to file`);
  } catch (error) {
    console.error("Error saving recipes file:", error.message);
  }
}

export const RecipeRepository = {
  findAll(query) {
    if (!query) return recipes;
    const q = query.toLowerCase();
    return recipes.filter((r) => r.title.toLowerCase().includes(q));
  },

  findById(id) {
    return recipes.find((r) => r.id === id) || null;
  },

  create(recipeData) {
    const nextId = recipes.length
      ? Math.max(...recipes.map((r) => r.id)) + 1
      : 1;
    const newRecipe = Recipe.create({
      id: nextId,
      ...recipeData
    });
    recipes.push(newRecipe);
    saveRecipesToFile();
    console.log(`✅ Recipe created: ${newRecipe.title} (ID: ${newRecipe.id})`);
    return newRecipe;
  },

  update(id, recipeData) {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return null;

    Object.assign(recipe, recipeData);
    saveRecipesToFile();
    return recipe;
  },

  delete(id) {
    const index = recipes.findIndex((r) => r.id === id);
    if (index === -1) return false;

    recipes.splice(index, 1);
    saveRecipesToFile();
    return true;
  }
};
