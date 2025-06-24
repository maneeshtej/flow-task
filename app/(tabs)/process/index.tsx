import { View, Text, Animated, StyleSheet } from "react-native";
import React, {
  useDebugValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AnimatedHeaderContainer from "../../../src/components/Header/AnimatedContainer";
import { useTaskStore } from "../../../src/store/taskStore";
import { Align, Spacer } from "../../../src/components/Useful";
import { CustomTextButton } from "../../../src/components/CustomButton";
import { Task } from "../../../src/models/task";
import DropdownPicker from "../../../src/components/Dropdowns/DropdownPicker";
import SmartList from "../../../src/components/List/SmartList";

const Process = () => {
  const { tasks, updateTask } = useTaskStore();
  const scrollY = useRef(new Animated.Value(0)).current;

  const inboxTasks = tasks.filter((task) => task.status === "inbox");

  const [taskContexts, setTaskContexts] = useState<Record<string, string>>({});
  const [taskProjects, setTaskProjects] = useState<Record<string, string>>({});

  const contextOptions = [
    { label: "Context", value: "none" },
    { label: "@home", value: "home" },
    { label: "@work", value: "work" },
    { label: "@computer", value: "computer" },
    { label: "@errands", value: "errands" },
  ];

  const projectOptions = [
    { label: "Project", value: "none" },
    { label: "Personal", value: "personal" },
    { label: "Work", value: "work" },
    { label: "Grocery", value: "grocery" },
    { label: "Assignments", value: "assignments" },
  ];

  const handleContextChange = (taskId: string, value: string) => {
    setTaskContexts((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleProjectChange = (taskId: string, value: string) => {
    setTaskProjects((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleProcessTask = (task: Task) => {
    const context = taskContexts[task.id];
    const projectId = taskProjects[task.id];

    updateTask(task.id, {
      status: "next",
      context: context !== "none" ? context : undefined,
      projectId: projectId !== "none" ? projectId : undefined,
    });
  };

  const slideAnimationsRef = useRef<Record<string, Animated.Value>>({});

  inboxTasks.forEach((task) => {
    if (!slideAnimationsRef.current[task.id]) {
      slideAnimationsRef.current[task.id] = new Animated.Value(150);
    }
  });

  useEffect(() => {
    inboxTasks.forEach((task) => {
      const context = taskContexts[task.id];
      const project = taskProjects[task.id];

      const bothSelected =
        context && context !== "none" && project && project !== "none";

      Animated.spring(slideAnimationsRef.current[task.id], {
        toValue: bothSelected ? 0 : 150,
        speed: 20,
        useNativeDriver: false,
      }).start();
    });
  }, [taskContexts, taskProjects]);

  return (
    <AnimatedHeaderContainer scrollY={scrollY} title="Process">
      {inboxTasks.length === 0 && (
        <Text style={styles.emptyText}>You're all caught up 🎉</Text>
      )}

      <SmartList
        data={inboxTasks}
        getKey={(task) => task.id}
        onProcessItem={handleProcessTask}
        renderItem={(task, _internalAnim, onProcess) => {
          const slideAnim = slideAnimationsRef.current[task.id];

          return (
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.title}>{task.title}</Text>

                <Animated.View
                  style={{
                    transform: [{ translateX: slideAnim }],
                  }}
                >
                  <CustomTextButton title="Process Task" onPress={onProcess} />
                </Animated.View>
              </View>

              <Spacer height={16} />

              <View style={{ flexDirection: "row", gap: 16 }}>
                <DropdownPicker
                  label="Context"
                  selectedValue={taskContexts[task.id] || "none"}
                  onValueChange={(value) => handleContextChange(task.id, value)}
                  options={contextOptions}
                />
                <DropdownPicker
                  label="Project"
                  selectedValue={taskProjects[task.id] || "none"}
                  onValueChange={(value) => handleProjectChange(task.id, value)}
                  options={projectOptions}
                />
              </View>

              <Spacer height={16} />
            </View>
          );
        }}
      />

      <Spacer height={100} />
    </AnimatedHeaderContainer>
  );
};

export default Process;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    overflow: "hidden",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e1e1e",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontStyle: "italic",
  },
});
