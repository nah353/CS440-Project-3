/**
 * Recipe Model - Data structure definition
 */
export class Recipe {
  constructor(id, title, description, ingredients, instructions, image, createdBy) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.image = image;
    this.createdBy = createdBy;
  }

  static create(data) {
    return new Recipe(
      data.id,
      data.title,
      data.description || "",
      data.ingredients || [],
      data.instructions,
      data.image || null,
      data.createdBy || "Unknown"
    );
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      ingredients: this.ingredients,
      instructions: this.instructions,
      image: this.image,
      createdBy: this.createdBy
    };
  }
}
