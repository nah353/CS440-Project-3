import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the server root directory
dotenv.config({ path: path.join(__dirname, "..", ".env") });

console.log("Environment loaded from:", path.join(__dirname, "..", ".env"));

import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
