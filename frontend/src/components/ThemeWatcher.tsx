import { useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";

const ThemeWatcher = () => {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  return null;
};

export default ThemeWatcher;

