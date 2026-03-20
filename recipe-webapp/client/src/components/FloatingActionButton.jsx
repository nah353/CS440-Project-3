import React from "react";

export default function FloatingActionButton({ onClick }) {
  return (
    <button 
      className="fab"
      onClick={onClick}
      title="Add Recipe"
    >
      +
    </button>
  );
}
