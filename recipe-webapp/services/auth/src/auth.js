import { AuthService } from "./services/authService.js";

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const user = AuthService.getCurrentUser(token);
  if (!user) return res.status(401).json({ error: "unauthorized" });
  req.user = user;
  req.user.token = token;
  next();
}
