import { View, Text, Animated, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AnimatedHeaderContainer from "../../../src/components/Header/AnimatedContainer";
import { useTaskStore } from "../../../src/store/taskStore";
import { Spacer } from "../../../src/components/Useful";
import { CustomTextButton } from "../../../src/components/CustomButton";
import { Task } from "../../../src/models/task";
import DropdownPicker from "../../../src/components/Dropdowns/DropdownPicker";
import SmartList from "../../../src/components/List/SmartList";
import { contextOptions } from "../../../src/constants/options";
import LottieView from "lottie-react-native";
import { useTheme } from "../../../src/context/ThemeContext";
import { getGlobalStyles } from "../../../src/styles/GlobalStyles";
import { useProjectStore } from "../../../src/store/projectStore";

const Process = () => {
  // Theme and global styles
  const { theme } = useTheme();
  const globalStyles = getGlobalStyles(theme);

  // App state stores
  const { tasks, updateTask } = useTaskStore();
  const { projects } = useProjectStore();

  // Animated scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  // Reference for tumbleweed Lottie animation
  const animationRef = useRef<LottieView>(null);

  // Filter inbox tasks (unprocessed)
  const inboxTasks = tasks.filter((task) => task.status === "inbox");

  // Selected context and project for each task
  const [taskContexts, setTaskContexts] = useState<Record<string, string>>({});
  const [taskProjects, setTaskProjects] = useState<Record<string, string>>({});

  // Track if all tasks are processed
  const [allCompleted, setAllCompleted] = useState(false);

  // Handle context dropdown change for a task
  const handleContextChange = (taskId: string, value: string) => {
    setTaskContexts((prev) => ({ ...prev, [taskId]: value }));
  };

  // Handle project dropdown change for a task
  const handleProjectChange = (taskId: string, value: string) => {
    setTaskProjects((prev) => ({ ...prev, [taskId]: value }));
  };

  // Finalize and update a task as "next"
  const handleProcessTask = (task: Task) => {
    const context = taskContexts[task.id];
    const projectId = taskProjects[task.id];

    updateTask(task.id, {
      status: "next",
      context: context !== "none" ? context : undefined,
      projectId: projectId !== "none" ? projectId : undefined,
    });
  };

  // Track slide-in animations for each task
  const slideAnimationsRef = useRef<Record<string, Animated.Value>>({});

  // Initialize slide animations if not already present
  inboxTasks.forEach((task) => {
    if (!slideAnimationsRef.current[task.id]) {
      slideAnimationsRef.current[task.id] = new Animated.Value(150);
    }
  });

  // Generate dropdown options for projects
  const projectOptions = useMemo(() => {
    return [
      { label: "None", value: "none" },
      ...projects.map((p) => ({ label: p.name, value: p.id })),
    ];
  }, [projects]);

  // UI: All tasks processed
  const AllCompletedComponent = () => (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 400,
      }}
    >
      <LottieView
        source={require("../../../assets/lottie/confetti.json")}
        autoPlay={true}
        loop={true}
        style={{ height: 200, width: 200 }}
      />
      <Text style={[styles.emptyText, { color: theme.textColor }]}>
        You're all caught up
      </Text>
    </View>
  );

  // UI: No tasks in inbox
  const EmptyComponent = () => (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
      }}
    >
      <LottieView
        source={require("../../../assets/lottie/tumble-weed.json")}
        loop={true}
        style={{ height: 200, width: 200 }}
        ref={animationRef}
      />
      <Text style={[styles.emptyText, { color: theme.textColor }]}>
        Go to inbox page to add tasks
      </Text>
    </View>
  );

  // Animate visibility of "Process Task" button when both dropdowns are selected
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

  // Trigger "all completed" state if inbox is empty
  useEffect(() => {
    if (tasks.length > 0 && inboxTasks.length === 0) {
      setAllCompleted(true);
    }
  }, [inboxTasks.length]);

  // Play tumbleweed animation when inbox is empty
  useEffect(() => {
    if (inboxTasks.length === 0) {
      setAllCompleted(false);
    }

    const timeout = setTimeout(() => {
      animationRef.current?.play();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatedHeaderContainer scrollY={scrollY} title="Process">
      {/* Show empty or all-complete view if no inbox tasks */}
      {inboxTasks.length === 0 &&
        (allCompleted ? <AllCompletedComponent /> : <EmptyComponent />)}

      {/* Main task list */}
      <SmartList
        data={inboxTasks}
        getKey={(task) => task.id}
        onProcessItem={handleProcessTask}
        renderItem={(task, _internalAnim, onProcess) => {
          const slideAnim = slideAnimationsRef.current[task.id];

          return (
            <View
              style={[
                globalStyles.card,
                {
                  flex: 1,
                  justifyContent: "space-between",
                  paddingTop: 10,
                },
              ]}
            >
              {/* Task title and process button */}
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={[globalStyles.heading]}>{task.title}</Text>

                  <Animated.View
                    style={{
                      transform: [{ translateX: slideAnim }],
                    }}
                  >
                    <CustomTextButton
                      title="Process Task"
                      onPress={onProcess}
                    />
                  </Animated.View>
                </View>

                {/* Optional description */}
                {task.description ? (
                  <Text style={[globalStyles.text]}>{task.description}</Text>
                ) : null}
              </View>

              {/* Context and Project dropdowns */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
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
    color: "#999",
    fontStyle: "italic",
  },
});
