import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightThemeBase, darkThemeBase } from "../constants/theme";
import { Theme } from "../constants/theme";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: { ...lightThemeBase, accentColor: "#3b82f6" },
  toggleTheme: () => {},
  setAccentColor: () => {},
});

const STORAGE_KEYS = {
  IS_DARK: "theme:isDark",
  ACCENT_COLOR: "theme:accentColor",
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [accentColor, setAccentColor] = useState("#3b82f6");

  useEffect(() => {
    // Load saved preferences
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

  const theme: Theme = {
    ...(isDark ? darkThemeBase : lightThemeBase),
    accentColor,
  };

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_DARK, String(next));
  };

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

export const useTheme = () => useContext(ThemeContext);
