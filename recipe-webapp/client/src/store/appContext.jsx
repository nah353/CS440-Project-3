/**
 * App Store Context - State Management Layer (Client)
 * Manages global application state (recipes, currentUser, etc.)
 */
import React, { createContext, useState, useCallback } from "react";
import { RecipeService } from "../services/recipeService";
import { AuthService } from "../services/authService";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [page, setPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  // Recipe operations
  const loadRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await RecipeService.listRecipes();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to load recipes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecipe = useCallback((newRecipe) => {
    setRecipes([...recipes, newRecipe]);
    setPage("home");
  }, [recipes]);

  const updateRecipeInList = useCallback((updatedRecipe) => {
    setRecipes(recipes.map((r) =>
      r.id === updatedRecipe.id ? updatedRecipe : r
    ));
    if (selectedRecipe?.id === updatedRecipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
    setPage("home");
    setEditingRecipe(null);
  }, [recipes, selectedRecipe]);

  const removeRecipe = useCallback((id) => {
    setRecipes(recipes.filter((r) => r.id !== id));
    setSelectedRecipe(null);
    setPage("home");
  }, [recipes]);

  // Authentication operations
  const restoreSession = useCallback(async () => {
    const user = await AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const registerUser = useCallback(async (username, password) => {
    const user = await AuthService.register(username, password);
    setCurrentUser(user);
    setPage("home");
    return user;
  }, []);

  const loginUser = useCallback(async (username, password) => {
    const user = await AuthService.login(username, password);
    setCurrentUser(user);
    setPage("home");
    return user;
  }, []);

  const logoutUser = useCallback(async () => {
    await AuthService.logout();
    setCurrentUser(null);
    setPage("home");
  }, []);

  // Authorization check
  const canManageRecipe = useCallback((recipe) => {
    return RecipeService.canManageRecipe(currentUser, recipe);
  }, [currentUser]);

  const value = {
    // State
    recipes,
    setRecipes,
    currentUser,
    setCurrentUser,
    loading,
    setLoading,
    selectedRecipe,
    setSelectedRecipe,
    editingRecipe,
    setEditingRecipe,
    page,
    setPage,
    searchQuery,
    setSearchQuery,

    // Recipe operations
    loadRecipes,
    addRecipe,
    updateRecipeInList,
    removeRecipe,

    // Auth operations
    restoreSession,
    registerUser,
    loginUser,
    logoutUser,

    // Helpers
    canManageRecipe
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
