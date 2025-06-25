import { View, Text, ViewStyle } from "react-native";
import React from "react";
import { GlobalStyles } from "../styles/globals";
import { useTheme } from "../context/ThemeContext";

type SpacerProps = {
  height?: number;
  width?: number;
};

type AlignProps = {
  children: React.ReactNode;
  horizontal?: "left" | "center" | "right";
  vertical?: "top" | "center" | "bottom";
  style?: ViewStyle;
};

type TextProps = {
  text: string;
  color?: string;
  accent?: boolean;
};

export const Spacer = ({ height = 20, width = 0 }: SpacerProps) => {
  return <View style={{ height, width }} />;
};

export const Divider = () => {
  const { theme } = useTheme();
  return (
    <View
      style={{ borderBottomColor: theme.textColor, borderBottomWidth: 0.5 }}
    />
  );
};

export const Heading = ({ text, accent }: TextProps) => {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        GlobalStyles.heading,
        { color: accent ? theme.accentColor : theme.textColor },
      ]}
    >
      {text}
    </Text>
  );
};

export const Title = ({ text }: TextProps) => {
  const { theme } = useTheme();
  return (
    <Text style={[GlobalStyles.title, { color: theme.textColor }]}>{text}</Text>
  );
};

export const Align = ({
  children,
  horizontal = "center",
  vertical = "center",
  style,
}: AlignProps) => {
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
