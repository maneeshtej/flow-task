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
import { Spacer } from "../../../src/components/Useful";
import { CustomTextButton } from "../../../src/components/CustomButton";
import { Task } from "../../../src/models/task";
import DropdownPicker from "../../../src/components/Dropdowns/DropdownPicker";
import SmartList from "../../../src/components/List/SmartList";
import { contextOptions, projectOptions } from "../../../src/constants/options";
import LottieView from "lottie-react-native";
import { useTheme } from "../../../src/context/ThemeContext";

const Process = () => {
  const { theme } = useTheme();
  const { tasks, updateTask } = useTaskStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<LottieView>(null);

  const inboxTasks = tasks.filter((task) => task.status === "inbox");

  const [taskContexts, setTaskContexts] = useState<Record<string, string>>({});
  const [taskProjects, setTaskProjects] = useState<Record<string, string>>({});
  const [allCompleted, setAllCompleted] = useState(false);

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

  const AllCompletedComponent = () => {
    return (
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
  };

  const EmptyComponent = () => {
    return (
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
  };

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

  useEffect(() => {
    if (tasks.length > 0 && inboxTasks.length === 0) {
      setAllCompleted(true);
    }
  }, [inboxTasks.length]);

  useEffect(() => {
    if (inboxTasks.length == 0) {
      setAllCompleted(false);
    }

    const timeout = setTimeout(() => {
      animationRef.current?.play();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatedHeaderContainer scrollY={scrollY} title="Process">
      {inboxTasks.length === 0 &&
        (allCompleted ? <AllCompletedComponent /> : <EmptyComponent />)}

      <SmartList
        data={inboxTasks}
        getKey={(task) => task.id}
        onProcessItem={handleProcessTask}
        renderItem={(task, _internalAnim, onProcess) => {
          const slideAnim = slideAnimationsRef.current[task.id];

          return (
            <View
              style={[styles.card, { backgroundColor: theme.backgroundColor }]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.title, { color: theme.textColor }]}>
                  {task.title}
                </Text>

                <Animated.View
                  style={{
                    transform: [{ translateX: slideAnim }],
                  }}
                >
                  <CustomTextButton title="Process Task" onPress={onProcess} />
                </Animated.View>
              </View>
              {task.description ? <Text>{task.description}</Text> : null}

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
    color: "#999",
    fontStyle: "italic",
  },
});
