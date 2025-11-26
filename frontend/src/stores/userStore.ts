import { create } from "zustand";
import { authApi } from "../utils/api";
import { isTokenExpired } from "../utils/constants";

export type UserRole = "patient" | "doctor" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenant: string;
  emailVerified: boolean;
  avatarUrl?: string;
};

type UserState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  oAuthInProgress: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, tenantName?: string) => Promise<void>;
  googleOAuthStart: () => Promise<void>;
  googleOAuthComplete: (token: string, user: User) => Promise<void>;
  fetchMe: () => Promise<void>;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setOAuthInProgress: (inProgress: boolean) => void;
};

// Cache for localStorage reads
let tokenCache: string | null = null;

const getCachedToken = (): string | null => {
  if (tokenCache === null) {
    tokenCache = localStorage.getItem("token");
  }
  return tokenCache;
};

const clearTokenCache = () => {
  tokenCache = null;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  oAuthInProgress: false,

  setToken: (token) => {
    if (token) {
      // Check expiration before storing
      if (isTokenExpired(token)) {
        console.warn("Token is expired, not storing");
        localStorage.removeItem("token");
        clearTokenCache();
        set({ token: null, user: null });
        return;
      }
      localStorage.setItem("token", token);
      clearTokenCache();
      set({ token });
    } else {
      localStorage.removeItem("token");
      clearTokenCache();
      set({ token: null });
    }
  },

  setUser: (user) => {
    set({ user });
  },

  setOAuthInProgress: (inProgress) => {
    set({ oAuthInProgress: inProgress });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await authApi.login({ email, password });
      const token = data.token;
      if (!token) {
        throw new Error("No token received from server");
      }
      get().setToken(token);
      await get().fetchMe();
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name: string, email: string, password: string, tenantName?: string) => {
    set({ isLoading: true });
    try {
      const data = await authApi.signup({ name, email, password, tenantName });
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  googleOAuthStart: async () => {
    set({ oAuthInProgress: true });
    try {
      const data = await authApi.startGoogle();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      set({ oAuthInProgress: false });
      throw error;
    }
  },

  googleOAuthComplete: async (token: string, user: User) => {
    set({ oAuthInProgress: true });
    try {
      get().setToken(token);
      set({ user });
      await get().fetchMe();
    } finally {
      set({ oAuthInProgress: false });
    }
  },

  fetchMe: async () => {
    const token = get().token || getCachedToken();
    if (!token) {
      set({ user: null });
      return;
    }

    // Check expiration
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      clearTokenCache();
      set({ user: null, token: null });
      return; // Don't throw, just return silently
    }

    set({ isLoading: true });
    try {
      const user = await authApi.getUser();
      if (user) {
        set({ user });
      } else {
        // No user data, clear token
        localStorage.removeItem("token");
        clearTokenCache();
        set({ user: null, token: null });
      }
    } catch (error: any) {
      const isAuthError = error?.response?.status === 401;
      if (isAuthError && !get().oAuthInProgress) {
        localStorage.removeItem("token");
        clearTokenCache();
        set({ user: null, token: null });
      }
      // Don't throw - just log and continue
      console.warn("Failed to fetch user:", error?.message || "Unknown error");
    } finally {
      set({ isLoading: false });
    }
  },

  initialize: async () => {
    try {
      const token = getCachedToken();
      if (token && !isTokenExpired(token)) {
        get().setToken(token);
        try {
          await get().fetchMe();
        } catch (error) {
          // If fetchMe fails, clear token and continue
          console.warn("Failed to fetch user on init:", error);
          localStorage.removeItem("token");
          clearTokenCache();
          set({ user: null, token: null });
        }
      } else {
        if (token) {
          // Expired token, clear it
          localStorage.removeItem("token");
          clearTokenCache();
        }
        set({ user: null, token: null });
      }
    } catch (error) {
      console.error("Initialization error:", error);
      // Ensure we don't hang on error
      set({ user: null, token: null, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local state even if API call fails
    } finally {
      localStorage.removeItem("token");
      clearTokenCache();
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
