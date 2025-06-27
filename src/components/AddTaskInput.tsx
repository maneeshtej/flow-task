// src/components/AddTaskInput.tsx

import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, StyleSheet, Animated } from "react-native";
import { CustomButton, CustomTextButton } from "./CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { Divider, Spacer, Align, Heading } from "./Useful";
import { useTheme } from "../context/ThemeContext";
import { getGlobalStyles } from "../styles/GlobalStyles";

type Props = {
  onAddTask: (title: string, desc?: string) => void; // Callback when task is added
};

const AddTaskInput = ({ onAddTask }: Props) => {
  const { theme } = useTheme(); // Access current theme
  const globalStyles = getGlobalStyles(theme); // Theme-aware styles

  const [title, setTitle] = useState(""); // Task title
  const [desc, setDesc] = useState(""); // Optional task description

  // Animation values for showing the Add button
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  // Animate Add button visibility based on title input
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

  // Handle pressing Add button
  const handleAdd = () => {
    if (title.trim()) {
      onAddTask(title.trim(), desc.trim() || undefined); // Fire callback
      setTitle(""); // Clear fields
      setDesc("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading text="Add Task" accent={true} />
        {/* Conditionally visible animated Add button */}
        <Animated.View style={{ opacity, transform: [{ scale }] }}>
          <CustomButton
            title="Add"
            onPress={handleAdd}
            leading={<Ionicons name="add" size={15} color="white" />}
          />
        </Animated.View>
      </View>

      <Spacer />

      {/* Input Fields */}
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
    color: "#1e1e1e", // Fallback; overridden by globalStyles.text
  },
  desc: {
    height: 80,
    textAlignVertical: "top", // Makes multiline text start at the top
  },
});
