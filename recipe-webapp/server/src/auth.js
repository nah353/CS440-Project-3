/**
 * Auth Middleware - Presentation Layer
 * Handles HTTP authentication checks
 */
import { AuthService } from "./services/authService.js";

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const user = AuthService.getCurrentUser(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = { username: user.username, token };
  next();
}
