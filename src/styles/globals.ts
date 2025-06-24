import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  title: {
    fontSize: 50,
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

export const AccentStyles = {
  backgroundColor: "white",
  textColor: "white",
  accentColor: "#8b5cf6",
};
