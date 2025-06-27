import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../../context/ThemeContext";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: Option[];
};

const CustomDropdown = ({
  label,
  selectedValue,
  onValueChange,
  options,
}: Props) => {
  // Local state to track dropdown open/closed
  const [open, setOpen] = useState(false);

  // Access theme from context
  const { theme } = useTheme();

  // Resolve label text from selected value
  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || "Select";

  return (
    <View>
      {/* Label + Selected value displayed inline */}
      <View style={styles.inlineRow}>
        {label ? (
          <Text style={[styles.label, { color: theme.textColor }]}>
            {label} :
          </Text>
        ) : null}

        {/* Button to open modal */}
        <Pressable onPress={() => setOpen(true)} style={styles.inlineTrigger}>
          <Text style={[styles.inlineText, { color: theme.accentColor }]}>
            {selectedLabel}
          </Text>
        </Pressable>
      </View>

      {/* Fullscreen modal for dropdown selection */}
      <Modal visible={open} transparent animationType="fade">
        {/* Tap outside to close */}
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <BlurView
            intensity={15}
            tint={theme.mode}
            style={StyleSheet.absoluteFill}
          />
        </TouchableWithoutFeedback>

        {/* Dropdown container */}
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.mode === "dark" ? "rgb(30,30,30)" : "#fff",
              borderColor: theme.mode === "dark" ? "#333" : "#eee",
            },
          ]}
        >
          {/* List of selectable options */}
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  onValueChange(item.value); // Send selected value
                  setOpen(false); // Close modal
                }}
              >
                <Text style={[styles.itemText, { color: theme.textColor }]}>
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 5,
    borderWidth: 1,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
  },
  inlineTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  inlineText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
