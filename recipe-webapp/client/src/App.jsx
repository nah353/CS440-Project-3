import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import FloatingActionButton from "./components/FloatingActionButton";
import RecipeCard from "./components/RecipeCard";
import RecipeDetail from "./pages/RecipeDetail";
import MediaScanner from "./components/mediaScanner";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import { fetchRecipes, deleteRecipe } from "./api/recipes";
import { getCurrentUser, logoutUser } from "./api/auth";
import { getAuthToken, setAuthToken } from "./api/client";
import "./styles/app.css";

const DEV_OVERRIDE_USER = "xfilly";

function canManageRecipe(user, recipe) {
  const username = String(user?.username || "").toLowerCase();
  const createdBy = String(recipe?.createdBy || "").toLowerCase();
  return username === DEV_OVERRIDE_USER || username === createdBy;
}

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [page, setPage] = useState("home");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadRecipes();
    restoreSession();
  }, []);

  const restoreSession = async () => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    try {
      const data = await getCurrentUser();
      setCurrentUser(data.user);
    } catch (error) {
      console.warn("Session restore failed:", error);
      setAuthToken(null);
      setCurrentUser(null);
    } finally {
    }
  };

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await fetchRecipes();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to load recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRecipe = (newRecipe) => {
    console.log("New recipe added:", newRecipe);
    // Add to current list
    setRecipes([...recipes, newRecipe]);
    // Go back to home
    setPage("home");
  };

  const handleAuthenticated = (user) => {
    setCurrentUser(user);
    setPage("home");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.warn("Logout request failed:", error);
    }
    setAuthToken(null);
    setCurrentUser(null);
    setPage("home");
  };

  const handleEditRecipe = (recipe) => {
    if (!currentUser) {
      setPage("auth");
      return;
    }

    if (!canManageRecipe(currentUser, recipe)) {
      alert("Only the creator can edit this recipe.");
      return;
    }

    console.log("Editing recipe:", recipe);
    setEditingRecipe(recipe);
    setSelectedRecipe(null);
    setPage("edit");
  };

  const handleRecipeUpdated = (updatedRecipe) => {
    console.log("Recipe updated:", updatedRecipe);
    // Update recipe in list
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
    // Update selected recipe
    if (selectedRecipe?.id === updatedRecipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
    // Go back to home
    setPage("home");
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = async (id) => {
    try {
      await deleteRecipe(id);
      console.log("Recipe deleted:", id);
      // Remove from list
      setRecipes(recipes.filter(r => r.id !== id));
      // Close detail panel
      setSelectedRecipe(null);
      setPage("home");
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      alert("Failed to delete recipe");
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(normalizedQuery)
  );
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="app">
      <Navbar setPage={setPage} currentPage={page} currentUser={currentUser} onLogout={handleLogout} />

      <main className="content">
        {page === "home" && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ margin: 0 }}>
                {isSearching ? `Results for "${searchQuery.trim()}"` : "All Recipes"}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '10px 16px',
                    width: '280px',
                    background: 'var(--bg-card)',
                    border: '2px solid var(--nau-blue)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--nau-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--nau-blue)'}
                />
                {isSearching && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '2px solid var(--nau-blue)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {loading && <p style={{ textAlign: 'center' }}>Loading recipes...</p>}
            {recipes.length === 0 && !loading && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No recipes yet. Start by adding one or scanning a food image!
              </p>
            )}
            {filteredRecipes.length === 0 && isSearching && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No recipes match your search.
              </p>
            )}
            {recipes.length > 0 && (
              <div className="recipe-grid">
                <RecipeCard recipes={filteredRecipes} onSelect={setSelectedRecipe} />
              </div>
            )}
          </div>
        )}

        {page === "scan" && (
          <div className="center-panel">
            <MediaScanner onRecipeDetected={handleNewRecipe} />
          </div>
        )}

        {page === "add" && (
          <div className="center-panel">
            <AddRecipe onRecipeAdded={handleNewRecipe} currentUser={currentUser} onRequireAuth={() => setPage("auth")} />
          </div>
        )}

        {page === "auth" && (
          <div className="center-panel">
            <Auth onAuthenticated={handleAuthenticated} />
          </div>
        )}

        {page === "account" && (
          <div>
            <Account
              currentUser={currentUser}
              recipes={recipes}
              onSelectRecipe={(recipe) => {
                setSelectedRecipe(recipe);
                setPage("home");
              }}
              onGoToAuth={() => setPage("auth")}
            />
          </div>
        )}

        {page === "edit" && editingRecipe && (
          <div className="center-panel">
            <EditRecipe recipe={editingRecipe} onRecipeUpdated={handleRecipeUpdated} />
          </div>
        )}

        {selectedRecipe && page !== "edit" && (
          <div className="detail-panel">
            <RecipeDetail 
              recipe={selectedRecipe} 
              onBack={() => setSelectedRecipe(null)}
              onEdit={handleEditRecipe}
              onDelete={handleDeleteRecipe}
              currentUser={currentUser}
              onRequireAuth={() => setPage("auth")}
            />
          </div>
        )}
      </main>

      <FloatingActionButton onClick={() => setPage(currentUser ? "add" : "auth")} />
    </div>
  );
}

export default App;
