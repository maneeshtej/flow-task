// src/styles/globalStyles.ts

import { StyleSheet, Platform } from "react-native";
import { Theme } from "../constants/theme";

export const getGlobalStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.backgroundColor,
    },
    title: {
      fontSize: 40,
      fontWeight: "500",
      color: theme.textColor,
      padding: 0,
      margin: 0,
      borderWidth: 0,
    },
    heading: {
      fontSize: 20,
      fontWeight: "400",
      color: theme.textColor,
    },
    card: {
      borderRadius: 20,
      padding: 16,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: theme.mode === "dark" ? "#333" : "#eee",
      ...getMinimalShadow(theme.mode),
      backgroundColor: theme.mode === "dark" ? "rgb(30,30,30)" : "#fff",
      ...getShadowStyle(theme.mode),
      overflow: "hidden",
    },
    minimalCard: {
      backgroundColor: theme.mode === "dark" ? "rgb(30,30,30)" : "#fff",
      padding: 16,
      borderRadius: 12,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: theme.mode === "dark" ? "#333" : "#eee",
      ...getMinimalShadow(theme.mode),
      overflow: "hidden",
    },
    accentText: {
      color: theme.accentColor,
    },
    accent: {
      color: theme.accentColor,
    },
    divider: {
      borderBottomColor: theme.textColor,
      borderBottomWidth: 0.5,
    },
    background: {
      backgroundColor: theme.backgroundColor,
    },
    text: {
      color: theme.textColor,
    },
    textSubtle: {
      color: "#999",
      fontStyle: "italic",
    },
  });

export const getShadowStyle = (mode: Theme["mode"]) => {
  if (Platform.OS === "android") {
    return {
      elevation: mode === "dark" ? 6 : 5,
    };
  }

  return {
    shadowColor: mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: mode === "dark" ? 6 : 10,
  };
};

export const getMinimalShadow = (mode: Theme["mode"]) => {
  if (Platform.OS === "android") {
    return {
      elevation: mode === "dark" ? 3 : 2,
    };
  }

  return {
    shadowColor: mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.05)",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: mode === "dark" ? 4 : 3,
  };
};
