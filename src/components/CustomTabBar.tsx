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

const tabs = [
  { name: "Inbox", href: "/inbox", icon: "mail-outline" },
  { name: "Process", href: "/process", icon: "funnel-outline" },
  { name: "Next", href: "/next-actions", icon: "checkmark-done-outline" },
  { name: "More", href: "/more", icon: "menu" },
];

const CustomTabBar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const DISC_SIZE = width * 0.12 + 20;
  const containerRef = useRef<View>(null);
  const tabRefs = useRef<Record<string, View | null>>({});

  const discX = useRef(new Animated.Value(0)).current;
  const [discIcon, setDiscIcon] = useState(tabs[0].icon);
  const [curLabel, setCurLabel] = useState(tabs[0].name);

  const fadeMap = useRef(
    Object.fromEntries(tabs.map((tab) => [tab.name, new Animated.Value(1)]))
  ).current;

  useEffect(() => {
    const activeTab = tabs.find((tab) => pathname.includes(tab.href));
    if (!activeTab || !tabRefs.current[activeTab.name]) return;

    tabRefs.current[activeTab.name]?.measureLayout(
      containerRef.current!,
      (x, _y, width) => {
        const centerX = x + width / 2;
        setDiscIcon(activeTab.icon);
        setCurLabel(activeTab.name);

        Animated.spring(discX, {
          toValue: centerX - DISC_SIZE / 2,
          useNativeDriver: true,
          speed: 30,
          bounciness: 8,
        }).start();

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
      <View style={[styles.innerWrapper]}>
        <View style={styles.tabBar} ref={containerRef}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              ref={(ref) => {
                tabRefs.current[tab.name] = ref;
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

      {/* More Button */}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    height: 90,
    zIndex: 100,
    justifyContent: "space-between",
    gap: 16,
  },
  innerWrapper: {
    flex: 7,
    borderRadius: 30,
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
