import React, { useRef, useState, useEffect } from "react";
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
import { AccentStyles } from "../styles/globals";

const tabs = [
  { name: "Inbox", href: "/inbox", icon: "mail-outline" },
  { name: "Process", href: "/process", icon: "funnel-outline" },
  { name: "Next", href: "/next-actions", icon: "checkmark-done-outline" },
  { name: "Projects", href: "/projects", icon: "briefcase-outline" },
];

const CustomTabBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const DISC_SIZE = width * 0.12 + 15;

  const containerRef = useRef<View>(null);
  const tabRefs = useRef<Record<string, View | null>>({});

  const discX = useRef(new Animated.Value(0)).current;
  const discScale = useRef(new Animated.Value(0)).current;
  const [discIcon, setDiscIcon] = useState(tabs[0].icon);
  const [curLabel, setCurLabel] = useState(tabs[0].name);
  const fadeMap = useRef(
    Object.fromEntries(tabs.map((tab) => [tab.name, new Animated.Value(1)]))
  ).current;

  useEffect(() => {
    const activeTab = tabs.find((tab) => pathname.includes(tab.href));
    if (
      !activeTab ||
      !tabRefs.current[activeTab.name] ||
      !containerRef.current
    ) {
      return;
    }

    tabRefs.current[activeTab.name]?.measureLayout(
      containerRef.current,
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

  const scale = discScale.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <View style={styles.wrapper}>
      {/* Floating Disc */}
      <Animated.View
        style={[
          styles.floatingDisc,
          {
            transform: [{ translateX: discX }, { translateY: -DISC_SIZE / 2 }],

            width: DISC_SIZE,
            height: DISC_SIZE,
            borderRadius: 70,
          },
        ]}
      >
        <Ionicons name={discIcon as any} size={20} color="#fff" />
        <Text style={[styles.label, { color: "white", fontSize: 8 }]}>
          {curLabel}
        </Text>
      </Animated.View>

      {/* Tab Bar */}
      <View style={styles.tabBar} ref={containerRef}>
        {tabs.map((tab) => {
          const isActive = pathname.includes(tab.href);
          return (
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
                <Ionicons
                  name={tab.icon as any}
                  size={24}
                  color={AccentStyles.accentColor}
                />
                <Text style={styles.label}>{tab.name}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 30,
    backgroundColor: AccentStyles.backgroundColor,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    zIndex: 100,
    height: 80,
    justifyContent: "center",
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
    fontSize: 12,
    color: AccentStyles.accentColor,
    marginTop: 4,
  },
  floatingDisc: {
    position: "absolute",
    top: "50%",
    backgroundColor: AccentStyles.accentColor,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
});
