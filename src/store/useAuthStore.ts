import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../api/authApi";

export interface AuthState {
  user: User | null;
  token: string | null;
  remember: boolean;
  expiresAt: number | null;
  isAuthenticated: boolean;

  setAuth: (data: { user: User; token: string; remember?: boolean }) => void;
  clearAuth: () => void;
  checkAuthExpiry: () => boolean;
  getToken: () => string | null;
}

// 30 days in milliseconds (30 days * 24 hrs * 60 mins * 60 secs * 1000 ms)
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
// Default session duration if remember is false (24 hours)
const DEFAULT_SESSION_MS = 24 * 60 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      remember: false,
      expiresAt: null,
      isAuthenticated: false,

      /**
       * Store logged user, token, remember preference, and 30-day session expiry
       */
      setAuth: ({ user, token, remember = false }) => {
        const duration = remember ? THIRTY_DAYS_MS : DEFAULT_SESSION_MS;
        const expiresAt = Date.now() + duration;

        // Persist tokens in browser storage for interceptors
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("jwt", token);
        storage.setItem("token", token);
        storage.setItem("user", JSON.stringify(user));
        storage.setItem("expiresAt", expiresAt.toString());

        set({
          user,
          token,
          remember,
          expiresAt,
          isAuthenticated: true,
        });
      },

      /**
       * Clear logged user, tokens, and reset store state
       */
      clearAuth: () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("k3_auth_store");
        sessionStorage.clear();

        set({
          user: null,
          token: null,
          remember: false,
          expiresAt: null,
          isAuthenticated: false,
        });
      },

      /**
       * Check if current session has expired (30-day limit for remember)
       */
      checkAuthExpiry: () => {
        const { expiresAt, token, clearAuth } = get();

        if (!token) {
          return false;
        }

        if (expiresAt && Date.now() > expiresAt) {
          console.warn(
            "[AuthStore] Session expired after 30 days. Clearing authentication state.",
          );
          clearAuth();
          return false;
        }

        return true;
      },

      /**
       * Get valid token or null if expired
       */
      getToken: () => {
        const isValid = get().checkAuthExpiry();
        return isValid ? get().token : null;
      },
    }),
    {
      name: "k3_auth_store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkAuthExpiry();
        }
      },
    },
  ),
);

export default useAuthStore;
