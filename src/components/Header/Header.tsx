import { View, Text, StyleSheet, Animated } from "react-native";
import React from "react";
import { Spacer } from "../Useful";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "../../store/taskStore";
import { useTheme } from "../../context/ThemeContext";
import { getGlobalStyles } from "../../styles/GlobalStyles";

// Props definition for the HeaderBar component
type HeaderProp = {
  title: string; // Screen title to display
  scrollY: Animated.Value; // Animated scroll value to interpolate header size
};

// Header height bounds for animation
const MAX_HEADER_HEIGHT = 120;
const MIN_HEADER_HEIGHT = 60;

const HeaderBar = ({ title, scrollY }: HeaderProp) => {
  const { theme } = useTheme(); // Get current theme from context
  const globalStyles = getGlobalStyles(theme); // Retrieve theme-based styles

  // Interpolated font size based on scroll position
  const fontSize = scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT],
    outputRange: [50, 30],
    extrapolate: "clamp",
  });

  // Interpolated horizontal movement for the avatar/icon
  const movex = scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT],
    outputRange: [0, 70],
    extrapolate: "clamp",
  });

  const { clearTasks } = useTaskStore(); // Not used here, but imported from the task store

  return (
    <View style={styles.wrapper}>
      {/* Add vertical spacing above the header */}
      <Spacer />

      {/* Main container for header content */}
      <View style={styles.container}>
        {/* Animated title that shrinks on scroll */}
        <Animated.Text
          style={[
            globalStyles.title, // Theme-based title styles
            {
              fontSize, // Dynamic font size
              lineHeight: fontSize, // Match line height to font size
            },
          ]}
        >
          {title}
        </Animated.Text>

        {/* Animated avatar that slides in on scroll */}
        <Animated.View
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: [{ translateX: movex }], // Horizontal translation
          }}
        >
          <Ionicons name="person-circle-outline" size={35} />
        </Animated.View>
      </View>

      {/* Add vertical spacing below the header */}
      <Spacer />
    </View>
  );
};

export default HeaderBar;

// Static styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Layout title and icon side by side
    alignItems: "center", // Vertically center content
    justifyContent: "space-between", // Push title left, icon right
  },
  wrapper: {
    paddingHorizontal: 16, // Horizontal padding around the header
  },
});
