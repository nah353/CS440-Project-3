import { Router } from "express";
import { RecipeRepository } from "../repositories/recipeRepository.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ recipes: RecipeRepository.findAll() });
});

router.get("/:id", (req, res) => {
  const r = RecipeRepository.findById(req.params.id);
  if (!r) return res.status(404).json({ error: "not found" });
  res.json(r);
});

router.post("/", (req, res) => {
  try {
    const created = RecipeRepository.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", (req, res) => {
  const updated = RecipeRepository.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "not found" });
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const ok = RecipeRepository.delete(req.params.id);
  res.json({ ok });
});

export default router;
