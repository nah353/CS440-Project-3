import React from "react";
import RecipeCard from "../components/RecipeCard";

export default function Account({ currentUser, recipes, onSelectRecipe, onGoToAuth }) {
  if (!currentUser) {
    return (
      <div className="container">
        <h1>Account</h1>
        <p className="muted">Log in to view your published recipes.</p>
        <button onClick={onGoToAuth}>Login / Sign Up</button>
      </div>
    );
  }

  const myRecipes = recipes.filter((recipe) => recipe.createdBy === currentUser.username);

  return (
    <div className="container">
      <h1>My Recipes</h1>
      <p className="muted">Showing recipes created by {currentUser.username}.</p>

      {myRecipes.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>
          You have not created any recipes yet.
        </p>
      ) : (
        <div className="recipe-grid">
          <RecipeCard recipes={myRecipes} onSelect={onSelectRecipe} />
        </div>
      )}
    </div>
  );
}
