import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";

// Define tabs with name, route, and icon
const tabs = [
  { name: "Inbox", href: "/inbox", icon: "mail-outline" },
  { name: "Process", href: "/process", icon: "funnel-outline" },
  { name: "Next", href: "/next-actions", icon: "checkmark-done-outline" },
  { name: "More", href: "/more", icon: "menu" },
];

const CustomTabBar = () => {
  const { theme } = useTheme();
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Navigation
  const { width } = useWindowDimensions();

  const DISC_SIZE = width * 0.12 + 20; // Floating disc diameter
  const containerRef = useRef<View>(null); // Ref to the tab bar container
  const tabRefs = useRef<Record<string, View | null>>({}); // Refs for each tab

  const discX = useRef(new Animated.Value(0)).current; // Disc horizontal movement
  const [discIcon, setDiscIcon] = useState(tabs[0].icon); // Current active icon
  const [curLabel, setCurLabel] = useState(tabs[0].name); // Current active label

  // Per-tab opacity for fade animations
  const fadeMap = useRef(
    Object.fromEntries(tabs.map((tab) => [tab.name, new Animated.Value(1)]))
  ).current;

  // On route change
  useEffect(() => {
    const activeTab = tabs.find((tab) => pathname.includes(tab.href));
    if (!activeTab || !tabRefs.current[activeTab.name]) return;

    // Get tab position to animate disc to it
    tabRefs.current[activeTab.name]?.measureLayout(
      containerRef.current!,
      (x, _y, width) => {
        const centerX = x + width / 2;

        // Update disc content
        setDiscIcon(activeTab.icon);
        setCurLabel(activeTab.name);

        // Animate disc movement
        Animated.spring(discX, {
          toValue: centerX - DISC_SIZE / 2,
          useNativeDriver: true,
          speed: 30,
          bounciness: 8,
        }).start();

        // Fade active tab out (since disc covers it)
        tabs.forEach((tab) => {
          Animated.timing(fadeMap[tab.name], {
            toValue: tab.name === activeTab.name ? 0 : 1,
            duration: 200,
            useNativeDriver: false,
          }).start();
        });
      },
      () => console.error("measureLayout failed")
    );
  }, [pathname]);

  return (
    <View style={styles.outerWrapper}>
      {/* Floating Accent Disc */}
      <Animated.View
        style={[
          styles.floatingDisc,
          {
            transform: [{ translateX: discX }, { translateY: -DISC_SIZE / 2 }],
            width: DISC_SIZE,
            height: DISC_SIZE,
            backgroundColor: theme.accentColor,
          },
        ]}
      >
        <Ionicons name={discIcon as any} size={24} color="#fff" />
        <Text style={styles.floatingText}>{curLabel}</Text>
      </Animated.View>

      {/* Tab Group */}
      <View style={styles.innerWrapper}>
        <View style={styles.tabBar} ref={containerRef}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              ref={(ref) => {
                tabRefs.current[tab.name] = ref; // Save ref for measuring
              }}
              onPress={() => router.push(`/(tabs)${tab.href}`)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[styles.tab, { opacity: fadeMap[tab.name] }]}
              >
                <Ionicons name={tab.icon as any} size={24} color="white" />
                <Text style={styles.label}>{tab.name}</Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default CustomTabBar;

// Styles for the entire custom tab bar layout
const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    height: 80,
    zIndex: 100,
    justifyContent: "space-between",
  },
  innerWrapper: {
    flex: 7,
    borderRadius: 100,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    opacity: 0.8,
    borderColor: "rgb(50, 50,50)",
    borderWidth: 1,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },
  label: {
    fontSize: 10,
    color: "white",
    marginTop: 4,
  },
  floatingDisc: {
    position: "absolute",
    top: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  floatingText: {
    color: "#fff",
    fontSize: 8,
    marginTop: 2,
  },
});
