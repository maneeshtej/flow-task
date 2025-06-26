import { View, Text, StyleSheet, Animated } from "react-native";
import { useRef, useState } from "react";
import { useTaskStore } from "../../../src/store/taskStore";
import { Heading, Spacer } from "../../../src/components/Useful";
import AddTaskInput from "../../../src/components/AddTaskInput";
import AnimatedHeaderContainer from "../../../src/components/Header/AnimatedContainer";
import LottieView from "lottie-react-native";
import { useTheme } from "../../../src/context/ThemeContext";
import { getGlobalStyles } from "../../../src/styles/GlobalStyles";
import { useProjectStore } from "../../../src/store/projectStore";

export default function InboxScreen() {
  const { tasks, addTask } = useTaskStore();
  const inboxTasks = tasks.filter((t) => t.status === "inbox");

  const scrollY = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();
  const globalStyles = getGlobalStyles(theme);

  return (
    <AnimatedHeaderContainer title="Inbox" scrollY={scrollY}>
      <AddTaskInput onAddTask={(title, desc) => addTask(title, desc)} />
      <Spacer height={40} />
      <Heading text="Tasks" accent />
      <Spacer />

      {inboxTasks.length > 0 ? (
        inboxTasks.map((item) => (
          <View key={item.id} style={[globalStyles.card]}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={[styles.description, { color: theme.textColor }]}>
                {item.description}
              </Text>
            )}
          </View>
        ))
      ) : (
        <View
          style={{
            height: 200,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LottieView
            source={require("../../../assets/lottie/mail.json")}
            autoPlay={true}
            loop={true}
            style={{ height: 100, width: 100 }}
          />
          <Text style={[styles.emptyText, { color: theme.textColor }]}>
            Add tasks to get started
          </Text>
        </View>
      )}
    </AnimatedHeaderContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e1e1e",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
  },
});
