import { View, TouchableOpacity } from "react-native";
import React from "react";
import {
  Divider,
  Heading,
  Spacer,
  Title,
} from "../../../src/components/Useful";
import { Ionicons } from "@expo/vector-icons";
import { CustomTextButton } from "../../../src/components/CustomButton";
import { useTheme } from "../../../src/context/ThemeContext";

const More = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Title text="Account" color={theme.textColor} />
      <Spacer />
      <View style={{ paddingHorizontal: 16 }}>
        {[
          { label: "Edit Projects" },
          { label: "Edit Contexts" },
          { label: "Task History" },
        ].map((item, index) => (
          <React.Fragment key={item.label}>
            <TouchableOpacity>
              <View
                style={{
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Heading text={item.label} color={theme.textColor} />
                <Ionicons
                  name="arrow-forward"
                  size={25}
                  color={theme.textColor}
                />
              </View>
            </TouchableOpacity>
            <Spacer height={7} />
          </React.Fragment>
        ))}

        <Divider />
        <Spacer height={7} />

        <CustomTextButton title="Toggle Theme" onPress={toggleTheme} />
      </View>
    </View>
  );
};

export default More;

const styles = {
  container: {
    padding: 16,
    flex: 1,
  },
};
