import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
} from "react-native";
import React, { useState } from "react";
import { Divider, Heading, Spacer } from "../../../src/components/Useful";
import { CustomTextButton } from "../../../src/components/CustomButton";
import { useTheme } from "../../../src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useProjectStore } from "../../../src/store/projectStore";

const accentColors = ["#3b82f6", "#8b5cf6", "#ef4444", "#10b981", "#f59e0b"];

const More = () => {
  // Access theme functions and values
  const { theme, toggleTheme, setAccentColor } = useTheme();

  // Access project state and actions
  const { projects, addProject, deleteProject } = useProjectStore();

  // Local state to hold input for new project
  const [projectName, setProjectName] = useState("");

  // Handle adding a new project
  const handleAddProject = () => {
    if (projectName.trim()) {
      addProject(projectName.trim());
      setProjectName("");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      {/* Appearance section: theme toggle and accent color */}
      <Heading text="Appearance" color={theme.textColor} />
      <Spacer />

      {/* Toggle between light/dark mode */}
      <CustomTextButton title="Toggle Theme" onPress={toggleTheme} />
      <Spacer height={16} />

      {/* Accent color selection */}
      <Heading text="Accent Color" color={theme.textColor} />
      <Spacer height={16} />

      {/* Color options as touchable dots */}
      <View style={styles.colorRow}>
        {accentColors.map((color, index) => (
          <TouchableOpacity
            key={color}
            onPress={() => setAccentColor(color)}
            style={[
              styles.colorDot,
              {
                backgroundColor: color,
                borderWidth: theme.accentColor === color ? 2 : 0,
                borderColor: "#999",
                marginRight: index !== accentColors.length - 1 ? 12 : 0,
              },
            ]}
          />
        ))}
      </View>

      <Spacer height={30} />
      <Divider />
      <Spacer height={30} />

      {/* Project management section */}
      <Heading text="Projects" color={theme.textColor} />
      <Spacer />

      {/* Input field and button to add new project */}
      <View style={styles.addRow}>
        <TextInput
          value={projectName}
          onChangeText={setProjectName}
          placeholder="New project name"
          placeholderTextColor="#999"
          style={[
            styles.input,
            { color: theme.textColor, borderColor: theme.textColor },
          ]}
        />
        <TouchableOpacity onPress={handleAddProject} style={styles.addButton}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Render the list of projects */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.projectItem}>
            {/* Display project name */}
            <Text style={[styles.projectText, { color: theme.textColor }]}>
              {item.name}
            </Text>

            {/* Show delete icon for non-default projects */}
            <TouchableOpacity style={{ paddingHorizontal: 26 }}>
              {item.name !== "Personal" &&
                item.name !== "Work" &&
                item.name !== "Grocery" &&
                item.name !== "Assignments" && (
                  <Ionicons
                    name="trash"
                    size={15}
                    onPress={() => {
                      deleteProject(item.id);
                    }}
                  />
                )}
            </TouchableOpacity>
          </View>
        )}
        // Message when no projects are available
        ListEmptyComponent={
          <Text style={[{ color: "#888", fontStyle: "italic", marginTop: 10 }]}>
            No projects added yet.
          </Text>
        }
      />
    </View>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
  },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#8b5cf6",
    padding: 10,
    borderRadius: 8,
  },
  projectItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  projectText: {
    fontSize: 16,
  },
});
