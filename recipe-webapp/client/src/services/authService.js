/**
 * Auth Service - Business Logic Layer (Client)
 * Encapsulates authentication operations
 */
import * as AuthAPI from "../api/auth";
import { getAuthToken, setAuthToken } from "../api/client";

export const AuthService = {
  async register(username, password) {
    const result = await AuthAPI.registerUser({ username, password });
    if (result.token) {
      setAuthToken(result.token);
    }
    return result.user;
  },

  async login(username, password) {
    const result = await AuthAPI.loginUser({ username, password });
    if (result.token) {
      setAuthToken(result.token);
    }
    return result.user;
  },

  async getCurrentUser() {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    try {
      const result = await AuthAPI.getCurrentUser();
      return result.user;
    } catch (error) {
      // Token invalid or expired
      setAuthToken(null);
      return null;
    }
  },

  async logout() {
    try {
      await AuthAPI.logoutUser();
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      setAuthToken(null);
    }
  },

  hasValidToken() {
    return !!getAuthToken();
  }
};
