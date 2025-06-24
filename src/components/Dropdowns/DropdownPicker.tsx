import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

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

  const moveX = useRef(new Animated.Value(0)).current;

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || "Select";

  return (
    <View style={styles.wrapper}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Pressable onPress={() => setOpen(true)} style={styles.dropdownButton}>
          <Text style={styles.buttonText}>{selectedLabel}</Text>
          <Ionicons name="chevron-down" size={18} color="#4c1d95" />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <BlurView
            intensity={10}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </TouchableWithoutFeedback>

        <View style={styles.dropdown}>
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
                <Text style={styles.itemText}>{item.label}</Text>
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
  wrapper: {},
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#4c1d95",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "flex-start",
    gap: 10,
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 13,
  },
  dropdown: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 5,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
    color: "#1e1e1e",
  },
});
