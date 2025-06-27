// src/components/Header/AnimatedHeaderContainer.tsx

import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Spacer } from "../Useful";
import HeaderBar from "./Header";
import { useTheme } from "../../context/ThemeContext";
import { getGlobalStyles } from "../../styles/GlobalStyles";

type Props = {
  title: string;
  scrollY: Animated.Value;
  children: React.ReactNode;
};

const AnimatedHeaderContainer = ({ title, scrollY, children }: Props) => {
  const { theme } = useTheme(); // Access current theme from context
  const globalStyles = getGlobalStyles(theme); // Get global styles based on theme

  return (
    // Main container with themed background and full height
    <View style={[globalStyles.background, { flex: 1 }]}>
      {/* Header bar that animates based on scroll position */}
      <HeaderBar title={title} scrollY={scrollY} />

      {/* Scrollable content with animated scroll tracking */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // useNativeDriver must be false for color/layout animation
        )}
        scrollEventThrottle={16} // Controls scroll update frequency
      >
        {/* Spacer adds space below header */}
        <Spacer />

        {/* Main children content rendered here */}
        {children}

        {/* Bottom spacer for spacing after content */}
        <Spacer height={100} />
      </Animated.ScrollView>
    </View>
  );
};

export default AnimatedHeaderContainer;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
