import { View, Text, StyleSheet, Animated } from "react-native";
import React, { useRef } from "react";
import { GlobalStyles } from "../styles/globals";
import { Spacer } from "./Useful";
import { Ionicons } from "@expo/vector-icons";

type HeaderProp = {
  title: string;
  scrollY: Animated.Value;
};

const MAX_HEADER_HEIGHT = 120;
const MIN_HEADER_HEIGHT = 60;

const HeaderBar = ({ title, scrollY }: HeaderProp) => {
  const fontSize = scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT],
    outputRange: [50, 30], // from 28px to 18px
    extrapolate: "clamp",
  });
  const movex = scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT],
    outputRange: [0, 70],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.wrapper}>
      <Spacer />
      <View style={styles.container}>
        <Animated.Text
          style={[
            GlobalStyles.title,
            {
              fontSize,
              lineHeight: fontSize, // helps vertical alignment
            },
          ]}
        >
          {title}
        </Animated.Text>
        <Animated.View
          style={{
            justifyContent: "center", // vertical center
            alignItems: "center",
            transform: [{ translateX: movex }],
          }}
        >
          <Ionicons name="person-circle-outline" size={35} />
        </Animated.View>
      </View>
      <Spacer />
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapper: {
    paddingHorizontal: 16,
  },
});
