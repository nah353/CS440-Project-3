import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Media service listening on ${PORT}`));
