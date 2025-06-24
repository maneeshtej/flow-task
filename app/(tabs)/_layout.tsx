import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import CustomTabBar from "../../src/components/CustomTabBar";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          <Slot />
          <CustomTabBar />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
