import express from "express";
import recipesRouter from "./routes/recipes.js";

const app = express();

app.use(express.json({ limit: '10mb' }));

app.use("/api/recipes", recipesRouter);

app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

export default app;
