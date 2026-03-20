import express from "express";
import cors from "cors";
import multer from "multer";

import healthRouter from "./routes/health.js";
import recipesRouter from "./routes/recipes.js";
import aiRouter from "./routes/aiRoutes.js";
import authRouter from "./routes/auth.js";

const app = express();
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

// CORS must come FIRST, before routes
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Increase payload size limit for base64 images
app.use(express.json({ limit: '10mb' }));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/ai", aiRouter);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: err.message
  });
});

export default app;
