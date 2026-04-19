import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: process.env.ENV_PATH || undefined });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Auth service listening on ${PORT}`);
});
