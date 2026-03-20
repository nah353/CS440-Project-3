import { Router } from "express";
import { authenticateUser, createUser } from "../db.js";
import { authRequired, createSession, deleteSession } from "../auth.js";

const router = Router();

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

router.post("/register", (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const password = String(req.body?.password || "");

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: "username must be at least 3 characters" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "password must be at least 6 characters" });
  }

  const user = createUser({ username, password });
  if (!user) {
    return res.status(409).json({ error: "username already exists" });
  }

  const token = createSession(user.username);
  return res.status(201).json({ token, user });
});

router.post("/login", (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const password = String(req.body?.password || "");

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const user = authenticateUser({ username, password });
  if (!user) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const token = createSession(user.username);
  return res.json({ token, user });
});

router.get("/me", authRequired, (req, res) => {
  return res.json({ user: { username: req.user.username } });
});

router.post("/logout", authRequired, (req, res) => {
  deleteSession(req.user.token);
  return res.json({ ok: true });
});

export default router;
