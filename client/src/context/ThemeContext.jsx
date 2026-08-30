import { createContext, useContext, useEffect, useState } from "react";

// ==========================================
// THEME CONTEXT & PROVIDER
// ==========================================
/**
 * Manages light / dark theme state across the Avora web application.
 * Persists user preference in localStorage under 'avora_theme' and syncs
 * the '.dark' CSS class on document.documentElement.
 */
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("avora_theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("avora_theme", theme);
  }, [theme]);

  // Dynamic Favicon system theme detector (Decoupled from Avora page theme)
  useEffect(() => {
    const favicon = document.getElementById("favicon");
    if (!favicon) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const updateFavicon = (e) => {
      const isSystemDark = e ? e.matches : mediaQuery.matches;
      favicon.setAttribute("href", isSystemDark ? "/avoraLogoLight.png" : "/avoraLogoDark.png");
      favicon.setAttribute("type", "image/png");
    };

    // Initial update
    updateFavicon();

    // Listen for system/browser prefers-color-scheme theme changes
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener("change", updateFavicon);
      return () => mediaQuery.removeEventListener("change", updateFavicon);
    } else {
      mediaQuery.addListener(updateFavicon);
      return () => mediaQuery.removeListener(updateFavicon);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
