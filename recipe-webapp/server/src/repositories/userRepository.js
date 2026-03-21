/**
 * User Repository - Data Access Layer
 * Handles all user persistence operations
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "..", "users.json");

let users = loadUsersFromFile();

function loadUsersFromFile() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error reading users file:", error.message);
  }
  return [];
}

function saveUsersToFile() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    console.log(`✅ Saved ${users.length} users to file`);
  } catch (error) {
    console.error("Error saving users file:", error.message);
  }
}

export const UserRepository = {
  findByUsername(username) {
    return users.find((u) => u.username === username) || null;
  },

  create(username, passwordHash) {
    const user = User.create(username, passwordHash);
    users.push({
      username: user.username,
      passwordHash: user.passwordHash
    });
    saveUsersToFile();
    return user;
  }
};
