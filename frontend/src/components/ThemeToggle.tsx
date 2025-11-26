import { motion } from "framer-motion";
import { useThemeStore } from "../stores/themeStore";

const ThemeToggle = () => {
  const mode = useThemeStore((state) => state.mode);
  const toggle = useThemeStore((state) => state.toggle);

  return (
    <button
      aria-label="Toggle color mode"
      onClick={toggle}
      className="relative flex h-10 w-20 items-center rounded-full border border-white/20 bg-white/20 px-2 py-1 shadow-glow transition hover:-translate-y-0.5 focus-ring dark:bg-white/5"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-dark-navy shadow dark:bg-night-sky dark:text-white"
      >
        {mode === "light" ? "☀️" : "🌙"}
      </motion.span>
      <span className="sr-only">Current mode: {mode}</span>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/60 to-accent-purple/60 opacity-40"
        animate={{ opacity: mode === "light" ? 0.25 : 0.7 }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      />
    </button>
  );
};

export default ThemeToggle;

