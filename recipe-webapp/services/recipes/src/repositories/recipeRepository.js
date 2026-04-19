import fs from "fs";
import path from "path";
import { Recipe } from "../models/recipe.js";

// store the recipes file inside the service working directory (/app)
const RECIPES_FILE = path.join(process.cwd(), "recipes.json");

let recipes = [];
try {
  if (fs.existsSync(RECIPES_FILE)) {
    const data = fs.readFileSync(RECIPES_FILE, "utf-8");
    recipes = JSON.parse(data);
  }
} catch (err) {
  console.error("Failed to load recipes.json:", err.message);
}

// Normalize older recipe records to current schema
function normalizeRecipe(r) {
  if (!r || typeof r !== 'object') return null;
  return {
    id: String(r.id || Date.now()),
    title: r.title || r.name || "Untitled",
    description: r.description || r.desc || "",
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : (r.ingredients ? [r.ingredients] : []),
    instructions: typeof r.instructions === 'string' ? r.instructions : (Array.isArray(r.steps) ? r.steps.join('\n') : (r.steps || '')),
    image: r.image || r.img || null,
    difficulty: r.difficulty || 'easy',
    createdBy: r.createdBy || r.author || r.createdBy || 'unknown'
  };
}

recipes = recipes.map(normalizeRecipe).filter(Boolean);

function save() {
  try {
    fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save recipes.json:", err.message);
  }
}

export const RecipeRepository = {
  findAll() {
    return recipes;
  },

  findById(id) {
    return recipes.find((r) => r.id === id) || null;
  },

  create(payload) {
    const id = String(Date.now());
    const recipe = Recipe.create({ id, ...payload });
    recipes.push(recipe);
    save();
    return recipe;
  },

  update(id, payload) {
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    recipes[idx] = { ...recipes[idx], ...payload };
    save();
    return recipes[idx];
  },

  delete(id) {
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    recipes.splice(idx, 1);
    save();
    return true;
  }
};
