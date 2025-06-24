import { View, Text, ViewStyle } from "react-native";
import React from "react";
import { AccentStyles, GlobalStyles } from "../styles/globals";

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
  return <View style={{ height, width }}></View>;
};

export const Divider = () => {
  return (
    <View style={{ borderBottomColor: "black", borderBottomWidth: 0.5 }}></View>
  );
};

export const Heading = ({ text, accent }: TextProps) => {
  return (
    <Text
      style={[
        GlobalStyles.heading,
        { color: accent ? AccentStyles.accentColor : "" },
      ]}
    >
      {text}
    </Text>
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
