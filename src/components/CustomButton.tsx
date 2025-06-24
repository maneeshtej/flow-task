import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Spacer } from "./Useful";
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
      <View style={[styles.button, { backgroundColor: "white" }]}>
        {leading}
        <Spacer height={0} width={5} />
        <Text style={{ color: "#8b5cf6" }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "#8b5cf6",
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    alignItems: "center",
  },
});
