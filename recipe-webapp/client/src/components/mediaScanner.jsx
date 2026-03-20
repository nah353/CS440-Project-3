import React, { useState } from "react";
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function MediaScanner({ onRecipeDetected }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (limit to 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is 50MB, but your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    // Validate file type
    const validTypes = ['image/', 'video/'];
    if (!validTypes.some(type => file.type.startsWith(type))) {
      setError(`Invalid file type: ${file.type}. Please upload an image or video.`);
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("media", file);

    try {
      console.log(`Uploading file: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)}KB)`);
      
      const response = await fetch(`${BASE}/ai/analyze`, {
        method: "POST",
        body: formData,
        // Note: Don't set Content-Type header - let the browser set it with boundary
      });

      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMsg = `${errorData.error || 'Failed to analyze media'}${errorData.details ? ': ' + errorData.details : ''}`;
        throw new Error(errorMsg);
      }

      const newRecipe = await response.json();
      console.log("Recipe generated successfully:", newRecipe);

      if (onRecipeDetected) {
        onRecipeDetected(newRecipe);
      }
      
      // Reset file input
      event.target.value = '';
    } catch (err) {
      console.error("AI Analysis failed:", err);
      // Provide more specific error messages
      let errorMsg = err.message || "Failed to analyze media. Please try again.";
      
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        errorMsg = "Network error - make sure the server is running on http://localhost:4000";
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

    return (
      <div className="card" style={{ border: '2px dashed var(--nau-gold)', textAlign: 'center', padding: '40px' }}>
        <div style={{
          background: 'rgba(255, 197, 47, 0.1)',
          border: '1px solid var(--nau-gold)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{ color: 'var(--nau-gold)', fontWeight: '600', margin: '0' }}>
            Beta Feature
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 0 0' }}>
            This feature is currently in beta and being improved. Please check back soon!
          </p>
        </div>

        <h3>Scan Food Image/Video</h3>
        <p className="muted">This AI-powered feature will automatically detect food and generate recipes.</p>
        
        <div style={{
          background: 'var(--bg-dark)',
          border: '1px dashed var(--border-color)',
          borderRadius: '8px',
          padding: '24px',
          marginTop: '20px',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ margin: '0' }}>Coming Soon</p>
        </div>

        {error && (
          <p style={{ 
            color: '#ff6b6b', 
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(255, 107, 107, 0.1)',
            borderLeft: '4px solid #ff6b6b',
            borderRadius: '4px',
            textAlign: 'left'
          }}>
            {error}
          </p>
        )}
      </div>
    );
}