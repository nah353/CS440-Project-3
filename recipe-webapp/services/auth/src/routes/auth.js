import { Router } from "express";
import { AuthService } from "../services/authService.js";
import { authRequired } from "../auth.js";

const router = Router();

router.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    const result = AuthService.register(username, password);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in register:", error.message);
    if (error.message === "username already exists") {
      return res.status(409).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const result = AuthService.login(username, password);
    res.json(result);
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(401).json({ error: error.message });
  }
});

router.get("/me", authRequired, (req, res) => {
  res.json({ user: { username: req.user.username } });
});

router.post("/logout", authRequired, (req, res) => {
  AuthService.deleteSession(req.user.token);
  res.json({ ok: true });
});

export default router;
