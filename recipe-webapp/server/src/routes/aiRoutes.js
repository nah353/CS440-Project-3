import express from "express";
import multer from "multer";
import { analyzeMedia } from "../services/geminiService.js";

const router = express.Router();
const upload = multer({ 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.post("/analyze", upload.single("media"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is not set in environment variables");
      return res.status(500).json({ 
        error: "Server is not properly configured",
        details: "GEMINI_API_KEY environment variable is not set. Please add it to server/.env" 
      });
    }

    console.log(`📤 Processing file: ${req.file.originalname} (${(req.file.size / 1024).toFixed(2)}KB)`);
    const recipeData = await analyzeMedia(req.file.buffer, req.file.mimetype);
    console.log(`📥 Sending response with recipe: ${recipeData.title}`);
    res.json(recipeData);
  } catch (error) {
    console.error("❌ Route error:", error.message);
    res.status(500).json({ 
      error: "Failed to analyze media",
      details: error.message 
    });
  }
});

export default router;