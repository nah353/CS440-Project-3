/**
 * Auth Service - Business Logic Layer
 * Handles authentication business logic
 */
import crypto from "crypto";
import { UserRepository } from "../repositories/userRepository.js";
import { validateAuthCredentials } from "./validationService.js";

// Session storage
const sessions = new Map();

// Password hashing utilities
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);
  return `${salt}:${hash}`;
}

function verifyPasswordHash(password, encodedHash) {
  const [salt, storedHash] = String(encodedHash || "").split(":");
  if (!salt || !storedHash) return false;

  const computedHash = hashPassword(password, salt);
  const storedBuffer = Buffer.from(storedHash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (storedBuffer.length !== computedBuffer.length) return false;
  return crypto.timingSafeEqual(storedBuffer, computedBuffer);
}

export const AuthService = {
  register(username, password) {
    // Validate credentials
    username = String(username || "").trim().toLowerCase();
    const error = validateAuthCredentials(username, password);
    if (error) {
      throw new Error(error);
    }

    // Check if user exists
    const existing = UserRepository.findByUsername(username);
    if (existing) {
      throw new Error("username already exists");
    }

    // Create user
    const passwordHash = createPasswordHash(password);
    const user = UserRepository.create(username, passwordHash);

    // Create session
    const token = this.createSession(user.username);

    return { token, user };
  },

  login(username, password) {
    // Validate credentials
    username = String(username || "").trim().toLowerCase();
    const error = validateAuthCredentials(username, password);
    if (error) {
      throw new Error(error);
    }

    // Find user
    const user = UserRepository.findByUsername(username);
    if (!user) {
      throw new Error("invalid username or password");
    }

    // Verify password
    const isValid = verifyPasswordHash(password, user.passwordHash);
    if (!isValid) {
      throw new Error("invalid username or password");
    }

    // Create session
    const token = this.createSession(user.username);

    return {
      token,
      user: { username: user.username }
    };
  },

  createSession(username) {
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { username, createdAt: Date.now() });
    return token;
  },

  getSession(token) {
    if (!token) return null;
    return sessions.get(token) || null;
  },

  deleteSession(token) {
    sessions.delete(token);
  },

  getCurrentUser(token) {
    const session = this.getSession(token);
    if (!session) return null;
    return { username: session.username };
  }
};
