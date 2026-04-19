import crypto from "crypto";
import { UserRepository } from "../repositories/userRepository.js";

const sessions = new Map();

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
    username = String(username || "").trim().toLowerCase();
    if (!username || !password) throw new Error("invalid credentials");
    const existing = UserRepository.findByUsername(username);
    if (existing) throw new Error("username already exists");
    const passwordHash = createPasswordHash(password);
    const user = UserRepository.create(username, passwordHash);
    const token = this.createSession(user.username);
    return { token, user };
  },

  login(username, password) {
    username = String(username || "").trim().toLowerCase();
    if (!username || !password) throw new Error("invalid credentials");
    const user = UserRepository.findByUsername(username);
    if (!user) throw new Error("invalid username or password");
    const isValid = verifyPasswordHash(password, user.passwordHash);
    if (!isValid) throw new Error("invalid username or password");
    const token = this.createSession(user.username);
    return { token, user: { username: user.username } };
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
