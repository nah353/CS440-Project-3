/**
 * App - Presentation Layer
 * Renders pages and delegates business logic to services and context
 */
import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import FloatingActionButton from "./components/FloatingActionButton";
import RecipeCard from "./components/RecipeCard";
import RecipeDetail from "./pages/RecipeDetail";
import MediaScanner from "./components/mediaScanner";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import { useAppContext } from "./store/appContext";
import "./styles/app.css";

function App() {
  try {
    const {
      recipes,
      currentUser,
      loading,
      selectedRecipe,
      editingRecipe,
      page,
      searchQuery,
      setPage,
      setSelectedRecipe,
      setEditingRecipe,
      setSearchQuery,
      loadRecipes,
      addRecipe,
      updateRecipeInList,
      removeRecipe,
      restoreSession,
      logoutUser,
      canManageRecipe
    } = useAppContext();

    useEffect(() => {
      loadRecipes();
      restoreSession();
    }, [loadRecipes, restoreSession]);

  const handleEditRecipe = (recipe) => {
    if (!currentUser) {
      setPage("auth");
      return;
    }

    if (!canManageRecipe(recipe)) {
      alert("Only the creator can edit this recipe.");
      return;
    }

    console.log("Editing recipe:", recipe);
    setEditingRecipe(recipe);
    setSelectedRecipe(null);
    setPage("edit");
  };

  const handleDeleteRecipe = async (id) => {
    try {
      const { RecipeService } = await import("./services/recipeService");
      await RecipeService.deleteRecipe(id);
      console.log("Recipe deleted:", id);
      removeRecipe(id);
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
      <Navbar
        setPage={setPage}
        currentPage={page}
        currentUser={currentUser}
        onLogout={logoutUser}
      />

      <main className="content">
        {page === "home" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
              }}
            >
              <h1 style={{ margin: 0 }}>
                {isSearching
                  ? `Results for "${searchQuery.trim()}"`
                  : "All Recipes"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "10px 16px",
                    width: "280px",
                    background: "var(--bg-card)",
                    border: "2px solid var(--nau-blue)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--nau-gold)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--nau-blue)")
                  }
                />
                {isSearching && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "2px solid var(--nau-blue)",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {loading && <p style={{ textAlign: "center" }}>Loading recipes...</p>}
            {recipes.length === 0 && !loading && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-secondary)"
                }}
              >
                No recipes yet. Start by adding one or scanning a food image!
              </p>
            )}
            {filteredRecipes.length === 0 && isSearching && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-secondary)"
                }}
              >
                No recipes match your search.
              </p>
            )}
            <div className="recipe-grid">
              {filteredRecipes.length > 0 &&
                filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSelect={() => {
                      setSelectedRecipe(recipe);
                    }}
                    onEdit={() => handleEditRecipe(recipe)}
                  />
                ))}
            </div>
          </div>
        )}

        {page === "scan" && (
          <div className="center-panel">
            <MediaScanner onRecipeDetected={addRecipe} />
          </div>
        )}

        {page === "add" && (
          <div className="center-panel">
            <AddRecipe
              onRecipeAdded={addRecipe}
              currentUser={currentUser}
              onRequireAuth={() => setPage("auth")}
            />
          </div>
        )}

        {page === "auth" && (
          <div className="center-panel">
            <Auth />
          </div>
        )}

        {page === "account" && (
          <div>
            <Account
              currentUser={currentUser}
              recipes={recipes}
              onSelectRecipe={(recipe) => {
                setSelectedRecipe(recipe);
              }}
              onGoToAuth={() => setPage("auth")}
            />
          </div>
        )}

        {page === "edit" && editingRecipe && (
          <div className="center-panel">
            <EditRecipe
              recipe={editingRecipe}
              onRecipeUpdated={updateRecipeInList}
            />
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

      <FloatingActionButton
        onClick={() => setPage(currentUser ? "add" : "auth")}
      />
    </div>
    );
  } catch (error) {
    console.error("App render error:", error);
    return <div style={{ color: "white", padding: "20px" }}>Error: {error.message}</div>;
  }
}

export default App;
