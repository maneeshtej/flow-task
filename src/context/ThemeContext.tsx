import React, { createContext, useContext, useState } from "react";
import { lightThemeBase, darkThemeBase } from "../constants/theme";
import { Theme } from "../constants/theme";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: { ...lightThemeBase, accentColor: "#8b5cf6" },
  toggleTheme: () => {},
  setAccentColor: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [accentColor, setAccentColor] = useState("#8b5cf6");

  const theme: Theme = {
    ...(isDark ? darkThemeBase : lightThemeBase),
    accentColor,
  };

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
