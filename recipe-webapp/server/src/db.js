/**
 * DEPRECATED - This file has been refactored into layered architecture
 * 
 * Previous monolithic database functions have been extracted into:
 * - Repositories: recipeRepository.js, userRepository.js (data access)
 * - Services: recipeService.js, authService.js, geminiService.js (business logic)
 * - Models: recipe.js, user.js (data structures)
 * - Auth middleware: auth.js (authentication handling)
 * 
 * This implements strict layered architecture:
 * Presentation Layer (routes) → Business Logic (services) → Data Access (repositories) → Data Storage
 */
