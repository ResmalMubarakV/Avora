import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// ==========================================
// THEME TOGGLE BUTTON COMPONENT
// ==========================================
/**
 * A compact navbar button that toggles between light and dark mode
 * with smooth icon rotation and scale micro-animations.
 */
const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-all duration-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700 shadow-sm cursor-pointer shrink-0 ${className}`}
    >
      <Sun
        size={18}
        className={`transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 opacity-0 absolute"
            : "rotate-0 scale-100 opacity-100 text-amber-500"
        }`}
      />
      <Moon
        size={18}
        className={`transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100 text-indigo-400"
            : "-rotate-90 scale-0 opacity-0 absolute"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
