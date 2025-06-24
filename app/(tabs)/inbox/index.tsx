import { View, Text, StyleSheet, Animated } from "react-native";
import { useRef } from "react";
import { useTaskStore } from "../../../src/store/taskStore";
import { Heading, Spacer } from "../../../src/components/Useful";
import AddTaskInput from "../../../src/components/AddTaskInput";
import AnimatedHeaderContainer from "../../../src/components/Header/AnimatedContainer";

export default function InboxScreen() {
  const { tasks, addTask } = useTaskStore();
  const inboxTasks = tasks.filter((t) => t.status === "inbox");

  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <AnimatedHeaderContainer title="Inbox" scrollY={scrollY}>
      <AddTaskInput onAddTask={(title, desc) => addTask(title, desc)} />
      <Spacer height={40} />
      <Heading text="Tasks" accent />
      <Spacer />

      {inboxTasks.length > 0 ? (
        inboxTasks.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No inbox tasks yet.</Text>
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
    marginTop: 40,
    color: "#999",
    fontStyle: "italic",
  },
});
