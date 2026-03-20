import React, { useState, useRef } from "react";
import { createRecipe } from "../api/recipes";

export default function AddRecipe({ onRecipeAdded, currentUser, onRequireAuth }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 3MB original)
      if (file.size > 3 * 1024 * 1024) {
        setError("Image is too large. Maximum size is 3MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file.");
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      // Create preview with compression
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        // Warn if base64 is too large (over 2MB)
        if (base64.length > 2 * 1024 * 1024) {
          console.warn(`Image base64 is ${(base64.length / 1024 / 1024).toFixed(2)}MB - may be too large for server`);
          setError("Image converted to base64 is too large. Try a smaller image.");
          setFormData(prev => ({ ...prev, imageFile: null }));
          return;
        }
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("You must be logged in to create a recipe.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.title.trim() || !formData.instructions.trim()) {
        setError("Title and Instructions are required.");
        setLoading(false);
        return;
      }

      const ingredientsList = formData.ingredients
        .split("\n")
        .map(ing => ing.trim())
        .filter(ing => ing.length > 0);

      let imageBase64 = null;
      if (formData.imageFile) {
        imageBase64 = imagePreview; // Already in base64 from FileReader
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ingredients: ingredientsList,
        instructions: formData.instructions.trim(),
        image: imageBase64
      };

      console.log("Creating recipe with payload:", { ...payload, image: imageBase64 ? "base64 image" : null });

      const newRecipe = await createRecipe(payload);
      
      console.log("Recipe created successfully:", newRecipe);

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        imageFile: null
      });
      setImagePreview(null);

      // Call callback to update parent
      if (onRecipeAdded) {
        console.log("Calling onRecipeAdded callback");
        onRecipeAdded(newRecipe);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating recipe:", err);
      setError(err.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Add Your Own Recipe</h1>
      <p className="muted">Share your favorite recipe with the community!</p>

      {!currentUser && (
        <p style={{
          color: '#ff6b6b',
          padding: '12px',
          background: 'rgba(255, 107, 107, 0.1)',
          borderLeft: '4px solid #ff6b6b',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          You need an account to publish recipes.
          <button
            type="button"
            onClick={onRequireAuth}
            style={{
              marginLeft: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--nau-gold)',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Login or sign up
          </button>
        </p>
      )}
      
      {success && (
        <p style={{ 
          color: '#4caf50',
          padding: '12px',
          background: 'rgba(76, 175, 80, 0.1)',
          borderLeft: '4px solid #4caf50',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          ✅ Recipe created successfully!
        </p>
      )}
      {error && (
        <p style={{ 
          color: '#ff6b6b',
          padding: '12px',
          background: 'rgba(255, 107, 107, 0.1)',
          borderLeft: '4px solid #ff6b6b',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          ❌ {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        {/* Image Upload */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontWeight: '600', color: 'var(--nau-gold)' }}>
            Recipe Image
          </label>
          {imagePreview && (
            <div style={{ 
              marginTop: '12px', 
              marginBottom: '16px',
              borderRadius: '8px',
              overflow: 'hidden',
              maxWidth: '100%',
              border: '2px solid var(--nau-blue)'
            }}>
              <img 
                src={imagePreview} 
                alt="Recipe preview" 
                style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
              />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            {(formData.imageFile || imagePreview) && (
              <button
                type="button"
                onClick={handleClearImage}
                aria-label="Remove image"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  color: '#b00020',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            )}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Max 5MB. Supported: JPG, PNG, GIF
          </p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', color: 'var(--nau-gold)' }}>Title *</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Chocolate Chip Cookies"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={30}
          />
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {formData.title.length}/30 characters
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', color: 'var(--nau-gold)' }}>Description</label>
          <textarea
            name="description"
            placeholder="Describe your dish..."
            value={formData.description}
            onChange={handleChange}
            maxLength={120}
            style={{ width: '100%', padding: '12px', marginTop: '8px', height: '80px' }}
          />
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {formData.description.length}/120 characters
          </div>
        </div>

        {/* Ingredients */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', color: 'var(--nau-gold)' }}>Ingredients *</label>
          <textarea
            name="ingredients"
            placeholder="One ingredient per line&#10;e.g.:&#10;2 cups flour&#10;1 cup sugar&#10;3 eggs"
            value={formData.ingredients}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', marginTop: '8px', height: '120px' }}
          />
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', color: 'var(--nau-gold)' }}>Difficulty *</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            style={{ marginTop: '8px', width: '100%', padding: '10px' }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Instructions */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', color: 'var(--nau-gold)' }}>Instructions *</label>
          <textarea
            name="instructions"
            placeholder="Step-by-step cooking instructions..."
            value={formData.instructions}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', marginTop: '8px', height: '120px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !currentUser}
          style={{ 
            width: '100%', 
            padding: '14px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || !currentUser ? 0.6 : 1
          }}
        >
          {loading ? "Creating Recipe..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
}
