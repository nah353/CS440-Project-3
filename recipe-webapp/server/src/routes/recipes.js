import { Router } from "express";
import {
  listRecipesHandler,
  getRecipeHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler
} from "../controllers/recipesController.js";
import { authRequired } from "../auth.js";

const router = Router();

router.get("/", listRecipesHandler);
router.post("/", authRequired, createRecipeHandler);
router.get("/:id", getRecipeHandler);
router.put("/:id", authRequired, updateRecipeHandler);
router.delete("/:id", authRequired, deleteRecipeHandler);

export default router;
