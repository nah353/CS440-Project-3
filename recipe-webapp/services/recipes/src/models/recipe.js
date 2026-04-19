export const Recipe = {
  create({ id, title, ingredients, instructions, image, description, difficulty, createdBy }) {
    return {
      id,
      title,
      description: description || "",
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      instructions: typeof instructions === "string" ? instructions : (Array.isArray(instructions) ? instructions.join("\n") : ""),
      image: image || null,
      difficulty: difficulty || "easy",
      createdBy: createdBy || "unknown"
    };
  }
};
