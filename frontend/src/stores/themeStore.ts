import { create } from "zustand";

type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  isDark: boolean;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

const THEME_KEY = "scan-sehat-theme";
const DEFAULT_THEME = (import.meta.env.VITE_DEFAULT_THEME as ThemeMode) || "light";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = window.localStorage.getItem(THEME_KEY) as ThemeMode | null;
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : DEFAULT_THEME;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: getInitialTheme(),
  get isDark() {
    return get().mode === "dark";
  },
  toggle: () =>
    set((state) => {
      const next = state.mode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_KEY, next);
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return { mode: next };
    }),
  setMode: (mode) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, mode);
      document.documentElement.classList.toggle("dark", mode === "dark");
    }
    set({ mode });
  }
}));

