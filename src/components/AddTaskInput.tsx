// src/components/AddTaskInput.tsx

import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Animated } from "react-native";
import { CustomButton, CustomTextButton } from "./CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { Divider, Spacer, Align, Heading } from "./Useful";
import { useTheme } from "../context/ThemeContext";
import { getGlobalStyles } from "../styles/GlobalStyles";

type Props = {
  onAddTask: (title: string, desc?: string) => void;
};

const AddTaskInput = ({ onAddTask }: Props) => {
  const { theme } = useTheme();
  const globalStyles = getGlobalStyles(theme);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const isVisible = title.trim() ? 1 : 0;

    Animated.timing(opacity, {
      toValue: isVisible,
      duration: 100,
      useNativeDriver: false,
    }).start();

    Animated.spring(scale, {
      toValue: isVisible,
      speed: 30,
      bounciness: 15,
      useNativeDriver: false,
    }).start();
  }, [title]);

  const handleAdd = () => {
    if (title.trim()) {
      onAddTask(title.trim(), desc.trim() || undefined);
      setTitle("");
      setDesc("");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading text="Add Task" accent={true} />
        <Animated.View style={{ opacity, transform: [{ scale }] }}>
          <CustomButton
            title="Add"
            onPress={handleAdd}
            leading={<Ionicons name="add" size={15} color="white" />}
          />
        </Animated.View>
      </View>
      <Spacer />
      <View style={{ paddingRight: 16 }}>
        <TextInput
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={globalStyles.text.color}
          style={[styles.input, globalStyles.text]}
        />
        <Divider />
        <TextInput
          placeholder="Description (optional)"
          value={desc}
          onChangeText={setDesc}
          placeholderTextColor={globalStyles.text.color}
          multiline
          style={[globalStyles.text, styles.input, styles.desc]}
        />
        <Divider />
      </View>
    </View>
  );
};

export default AddTaskInput;

const styles = StyleSheet.create({
  container: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  input: {
    paddingVertical: 8,
    fontSize: 16,
    color: "#1e1e1e",
  },
  desc: {
    height: 80,
    textAlignVertical: "top",
  },
});
