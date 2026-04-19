export function validateAuthCredentials(username, password) {
  username = String(username || "").trim().toLowerCase();
  if (!username || username.length < 3) return "username must be at least 3 characters";
  if (!password || password.length < 6) return "password must be at least 6 characters";
  return null;
}
