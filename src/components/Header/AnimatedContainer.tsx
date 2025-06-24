// src/components/Header/AnimatedHeaderContainer.tsx

import React from "react";
import { View, Animated, StyleSheet, ScrollViewProps } from "react-native";
import { Spacer } from "../Useful";
import HeaderBar from "./Header";

type Props = {
  title: string;
  scrollY: Animated.Value;
  children: React.ReactNode;
};

const AnimatedHeaderContainer = ({ title, scrollY, children }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <HeaderBar title={title} scrollY={scrollY} />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Spacer />
        {children}
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
