import React from "react";

export default function RecipeCard({ recipes, onSelect }) {
  return (
    <>
      {recipes.map((recipe) => (
        <div 
          key={recipe.id} 
          className="card" 
          onClick={() => onSelect(recipe)}
          style={{ cursor: "pointer", overflow: 'hidden', padding: 0 }}
        >
          {recipe.image && (
            <div style={{
              width: '100%',
              height: '180px',
              overflow: 'hidden',
              background: 'var(--bg-dark)'
            }}>
              <img 
                src={recipe.image} 
                alt={recipe.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
          <div className="card-content" style={{ padding: '20px' }}>
            <h3>{recipe.title}</h3>
            <p className="muted">
              {recipe.description || "No description provided for this delicious recipe."}
            </p>
            <p className="small" style={{ marginBottom: '8px' }}>
              Created by: {recipe.createdBy || "Unknown"}
            </p>
            <span className="small">
              {recipe.ingredients?.length ?? 0} Ingredients
            </span>
          </div>
        </div>
      ))}
    </>
  );
}