export interface Theme {
  mode: "light" | "dark";
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

// src/styles/globals.ts

export const lightThemeBase = {
  mode: "light" as const,
  backgroundColor: "white",
  textColor: "black",
};

export const darkThemeBase = {
  mode: "dark" as const,
  backgroundColor: "black",
  textColor: "white",
};
