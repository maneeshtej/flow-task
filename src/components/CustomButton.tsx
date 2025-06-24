import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Spacer } from "./Useful";
import { AccentStyles } from "../styles/globals";
type ButtonProps = {
  title: string;
  onPress: () => any;
  leading?: React.ReactNode;
};

export const CustomButton = ({ title, onPress, leading }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        {leading}
        <Spacer height={0} width={10} />
        <Text style={{ color: "white", fontSize: 15 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const CustomTextButton = ({ title, onPress, leading }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[styles.button, { backgroundColor: "transparent", padding: 0 }]}
      >
        {leading}
        <Spacer height={0} width={5} />
        <Text style={{ color: AccentStyles.accentColor }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: AccentStyles.accentColor,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    alignItems: "center",
  },
});
