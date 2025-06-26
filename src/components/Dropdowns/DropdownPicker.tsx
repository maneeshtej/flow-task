import React, { useRef, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getGlobalStyles } from "../../styles/GlobalStyles";

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
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const globalStyles = getGlobalStyles(theme);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || "Select";

  return (
    <View>
      <View style={styles.inlineRow}>
        {label ? (
          <Text style={[styles.label, { color: theme.textColor }]}>
            {label} :
          </Text>
        ) : null}

        <Pressable onPress={() => setOpen(true)} style={styles.inlineTrigger}>
          <Text style={[styles.inlineText, { color: theme.accentColor }]}>
            {selectedLabel}
          </Text>
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <BlurView
            intensity={15}
            tint={theme.mode}
            style={StyleSheet.absoluteFill}
          />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.mode === "dark" ? "rgb(30,30,30)" : "#fff",
              borderColor: theme.mode === "dark" ? "#333" : "#eee",
            },
          ]}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  onValueChange(item.value);
                  setOpen(false);
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
