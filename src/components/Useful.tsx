import { View, Text, ViewStyle } from "react-native";
import React from "react";
import { GlobalStyles } from "../styles/globals"; // Not used in this file
import { useTheme } from "../context/ThemeContext";
import { getGlobalStyles } from "../styles/GlobalStyles";

// Props for Spacer component: vertical and/or horizontal spacing
type SpacerProps = {
  height?: number;
  width?: number;
};

// Props for Align component: alignment directions + optional style
type AlignProps = {
  children: React.ReactNode;
  horizontal?: "left" | "center" | "right";
  vertical?: "top" | "center" | "bottom";
  style?: ViewStyle;
};

// Props for Heading and Title text
type TextProps = {
  text: string;
  color?: string; // Unused
  accent?: boolean;
};

// Spacer component for layout spacing
export const Spacer = ({ height = 20, width = 0 }: SpacerProps) => {
  return <View style={{ height, width }} />;
};

// Divider with adaptive theming
export const Divider = () => {
  const { theme } = useTheme();
  const globalStyles = getGlobalStyles(theme);
  return (
    <View
      style={{
        borderBottomColor: globalStyles.text.color,
        borderBottomWidth: 0.5,
      }}
    />
  );
};

// Heading text with optional accent coloring
export const Heading = ({ text, accent }: TextProps) => {
  const { theme } = useTheme();
  const globalStyles = getGlobalStyles(theme);
  return (
    <Text
      style={[
        globalStyles.heading,
        {
          color: accent ? globalStyles.accent.color : globalStyles.text.color,
        },
      ]}
    >
      {text}
    </Text>
  );
};

// Large title text (assumes styling from theme)
export const Title = ({ text }: TextProps) => {
  const { theme } = useTheme();
  const globalStyles = getGlobalStyles(theme);
  return <Text style={[globalStyles.title]}>{text}</Text>;
};

// Flexible alignment component
export const Align = ({
  children,
  horizontal = "center",
  vertical = "center",
  style,
}: AlignProps) => {
  // Maps string props to flex alignment values
  const justifyContentMap: Record<string, ViewStyle["justifyContent"]> = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
  };

  const alignItemsMap: Record<string, ViewStyle["alignItems"]> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  return (
    <View
      style={[
        {
          justifyContent: justifyContentMap[vertical],
          alignItems: alignItemsMap[horizontal],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
