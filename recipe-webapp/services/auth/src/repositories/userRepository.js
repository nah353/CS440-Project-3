import fs from "fs";
import path from "path";
import { User } from "../models/user.js";

// store users.json at the service working directory root inside the container
// Dockerfile copies the service files into /app, so use /app/users.json
const USERS_FILE = path.join(process.cwd(), "users.json");

let users = [];
try {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    users = JSON.parse(data);
  }
} catch (err) {
  console.error("Failed to load users.json:", err.message);
}

function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save users.json (", USERS_FILE, "):", err.message);
  }
}

export const UserRepository = {
  findByUsername(username) {
    return users.find((u) => u.username === username) || null;
  },

  create(username, passwordHash) {
    const user = User.create(username, passwordHash);
    users.push({ username: user.username, passwordHash: user.passwordHash });
    saveUsers();
    return user;
  }
};
