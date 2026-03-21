/**
 * Validation Service - Business Logic Layer
 * Validates recipe and auth data
 */

export function validateRecipeData(data) {
  const { title, description, ingredients, instructions, image } = data;

  // Validate required fields
  if (!title || !instructions) {
    return "title and instructions are required";
  }

  // Validate lengths
  if (title && String(title).trim().length > 30) {
    return "title must be 30 characters or fewer";
  }

  if (description && String(description).trim().length > 120) {
    return "description must be 120 characters or fewer";
  }

  // Validate ingredients
  if (!Array.isArray(ingredients)) {
    return "ingredients must be an array";
  }

  // Validate image if provided
  if (image && typeof image !== "string") {
    return "image must be a base64 string";
  }

  // Check image size (max 5MB for base64)
  if (image && image.length > 5 * 1024 * 1024) {
    return "image is too large. Max 5MB.";
  }

  return null;
}

export function validateAuthCredentials(username, password) {
  // Normalize username
  username = String(username || "").trim().toLowerCase();

  if (!username || !password) {
    return "username and password are required";
  }

  if (username.length < 3) {
    return "username must be at least 3 characters";
  }

  if (password.length < 6) {
    return "password must be at least 6 characters";
  }

  return null;
}
