import crypto from "crypto";

const sessions = new Map();

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function createUserPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);
  return `${salt}:${hash}`;
}

export function verifyPassword(password, encodedHash) {
  const [salt, storedHash] = String(encodedHash || "").split(":");
  if (!salt || !storedHash) return false;

  const computedHash = hashPassword(password, salt);
  const storedBuffer = Buffer.from(storedHash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (storedBuffer.length !== computedBuffer.length) return false;
  return crypto.timingSafeEqual(storedBuffer, computedBuffer);
}

export function createSession(username) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { username, createdAt: Date.now() });
  return token;
}

export function getSession(token) {
  if (!token) return null;
  return sessions.get(token) || null;
}

export function deleteSession(token) {
  sessions.delete(token);
}

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const session = getSession(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = { username: session.username, token };
  next();
}
