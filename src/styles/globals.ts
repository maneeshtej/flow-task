import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "500",
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
  heading: {
    fontSize: 20,
    fontWeight: "400",
  },
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  minimalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    overflow: "hidden",
  },
  accentText: {
    color: "#8b5cf6",
  },
  accent: {
    color: "#8b5cf6",
  },
  styles: {
    backgroundColor: "white",
    color: "white",
  },
});

// src/constants/theme.ts

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
