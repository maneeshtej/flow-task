import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightThemeBase, darkThemeBase } from "../constants/theme";
import { Theme } from "../constants/theme";

// Theme context type definition
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setAccentColor: (color: string) => void;
}

// Default context (used before provider is mounted)
const ThemeContext = createContext<ThemeContextType>({
  theme: { ...lightThemeBase, accentColor: "#3b82f6" },
  toggleTheme: () => {},
  setAccentColor: () => {},
});

// Keys used in AsyncStorage
const STORAGE_KEYS = {
  IS_DARK: "theme:isDark",
  ACCENT_COLOR: "theme:accentColor",
};

// ThemeProvider supplies theme state and persistence
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [accentColor, setAccentColor] = useState("#3b82f6");

  // Load saved theme settings on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const darkValue = await AsyncStorage.getItem(STORAGE_KEYS.IS_DARK);
        const accent = await AsyncStorage.getItem(STORAGE_KEYS.ACCENT_COLOR);
        if (darkValue !== null) setIsDark(darkValue === "true");
        if (accent !== null) setAccentColor(accent);
      } catch (e) {
        console.log("Failed to load theme", e);
      }
    };
    loadTheme();
  }, []);

  // Computed theme object based on current state
  const theme: Theme = {
    ...(isDark ? darkThemeBase : lightThemeBase),
    accentColor,
  };

  // Toggle between light and dark mode
  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_DARK, String(next));
  };

  // Update accent color and persist it
  const changeAccent = async (color: string) => {
    setAccentColor(color);
    await AsyncStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, color);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setAccentColor: changeAccent }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context anywhere in the app
export const useTheme = () => useContext(ThemeContext);
