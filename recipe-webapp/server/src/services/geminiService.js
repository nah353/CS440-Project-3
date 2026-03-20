import { GoogleGenerativeAI } from "@google/generative-ai";

// Validate API key on startup
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  WARNING: GEMINI_API_KEY is not set in environment variables!");
  console.warn("Please set GEMINI_API_KEY in server/.env file");
} else {
  console.log("✅ GEMINI_API_KEY is configured");
}

// Use the API key from your server's .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeMedia(fileBuffer, mimeType) {
  try {
    // Double-check API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set. Please configure it in server/.env");
    }

    console.log(`📸 Analyzing media (${mimeType})...`);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a recipe expert. Identify the food in this ${mimeType.startsWith("video") ? "video" : "image"}. 
    Provide a detailed recipe including:
    1. Title - the name of the dish
    2. Description - brief description of the dish
    3. Ingredients - list of ingredients needed
    4. Instructions - step-by-step cooking instructions
    
    IMPORTANT: Return ONLY a JSON object with exactly these keys: title, description, ingredients (array of strings), instructions (string).
    Do not include any text before or after the JSON.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType
        },
      },
    ]);

    const response = await result.response;
    
    if (!response) {
      throw new Error("No response from Gemini API");
    }

    const text = response.text();
    console.log("Raw response:", text.substring(0, 200) + "...");
    
    // Extract JSON from response (in case there's text before/after)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from response. Full response:", text);
      throw new Error("API response did not contain valid JSON. Response: " + text.substring(0, 200));
    }
    
    let recipeData;
    try {
      recipeData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError.message);
      console.error("Attempted to parse:", jsonMatch[0].substring(0, 300));
      throw new Error("Could not parse API response as JSON: " + parseError.message);
    }

    // Validate required fields
    if (!recipeData.title || !recipeData.instructions) {
      throw new Error("Recipe missing required fields (title or instructions)");
    }

    // Ensure ingredients is an array
    if (!Array.isArray(recipeData.ingredients)) {
      if (typeof recipeData.ingredients === 'string') {
        recipeData.ingredients = recipeData.ingredients.split('\n').filter(i => i.trim());
      } else {
        recipeData.ingredients = [];
      }
    }

    console.log("✅ Successfully analyzed media:", recipeData.title);
    return recipeData;
  } catch (error) {
    console.error("❌ Error in analyzeMedia:", error.message);
    console.error("Full error:", error);
    throw new Error(`Media analysis failed: ${error.message}`);
  }
}