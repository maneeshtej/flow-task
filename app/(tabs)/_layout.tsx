import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import CustomTabBar from "../../src/components/CustomTabBar";
import { ThemeProvider, useTheme } from "../../src/context/ThemeContext";
import { StatusBar } from "react-native";

function InnerLayout() {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <StatusBar
        backgroundColor={theme.backgroundColor}
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
        animated={true}
      />
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}
          edges={["top", "left", "right"]}
        >
          <Slot />
          <CustomTabBar />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
