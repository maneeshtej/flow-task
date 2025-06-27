import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import CustomTabBar from "../../src/components/CustomTabBar";
import { ThemeProvider, useTheme } from "../../src/context/ThemeContext";
import { StatusBar } from "react-native";

function InnerLayout() {
  const { theme } = useTheme(); // Access current theme (light/dark, colors)

  return (
    // Wraps the app with gesture support (required by gesture handler)
    <GestureHandlerRootView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      {/* Sets status bar style and background dynamically based on theme */}
      <StatusBar
        backgroundColor={theme.backgroundColor}
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
        animated={true}
      />

      {/* Provides safe area context for iOS and Android */}
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}
          edges={["top", "left", "right"]} // Apply safe area only to these edges
        >
          {/* Renders the current screen's content */}
          <Slot />

          {/* Custom floating tab bar for navigation */}
          <CustomTabBar />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Root layout wraps everything inside ThemeProvider (global theming)
export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}

// Basic layout styling
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill entire screen
  },
  safeArea: {
    flex: 1,
  },
});
