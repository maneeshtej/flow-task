import { View, Text, Animated, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AnimatedHeaderContainer from "../../../src/components/Header/AnimatedContainer";
import { useTaskStore } from "../../../src/store/taskStore";
import CustomDropdown from "../../../src/components/Dropdowns/DropdownPicker";
import { contextOptions } from "../../../src/constants/options";
import SmartList from "../../../src/components/List/SmartList";
import LottieView from "lottie-react-native";
import { useTheme } from "../../../src/context/ThemeContext";
import { getGlobalStyles } from "../../../src/styles/GlobalStyles";
import { useProjectStore } from "../../../src/store/projectStore";

const NextActions = () => {
  // Theme and global styles
  const { theme } = useTheme();
  const globalStyles = getGlobalStyles(theme);

  // Scroll position for animated header
  const scrollY = useRef(new Animated.Value(0)).current;

  // Task and project state
  const { tasks, updateTask } = useTaskStore();
  const { projects } = useProjectStore();

  // Filter state
  const [selectedContext, setSelectedContext] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");

  // Completion tracking
  const [allCompleted, setAllCompleted] = useState(false);
  const animOpacity = useRef(new Animated.Value(0)).current;
  const wasJustCompleted = useRef(false);

  // Animation control
  const animationRef = useRef<LottieView>(null);

  // Toggle to show completed tasks
  const [showCompleted, setShowCompleted] = useState(false);

  // Filtered list of 'next' tasks
  const nextTasks = useMemo(() => {
    return tasks.filter((task) => {
      const isNext = task.status === "next";
      const matchContext =
        selectedContext === "all" || selectedContext === task.context;
      const matchProject =
        selectedProject === "all" || selectedProject === task.projectId;

      return isNext && matchContext && matchProject;
    });
  }, [tasks, selectedContext, selectedProject]);

  // Filtered list of 'done' tasks
  const doneTasks = useMemo(() => {
    return tasks.filter((task) => {
      const isDone = task.status === "done";
      const matchContext =
        selectedContext === "all" || selectedContext === task.context;
      const matchProject =
        selectedProject === "all" || selectedProject === task.projectId;

      return isDone && matchContext && matchProject;
    });
  }, [tasks, selectedContext, selectedProject]);

  // Whether any next tasks exist at all
  const hasAnyNextTasks = useMemo(() => {
    return tasks.some((task) => task.status === "next");
  }, [tasks]);

  // Handler to mark a task as done
  const markAsDone = (taskId: string) => {
    updateTask(taskId, { status: "done" });
    wasJustCompleted.current = true;
  };

  // Project dropdown options
  const projectOptions = useMemo(() => {
    return [
      { label: "All Projects", value: "all" },
      ...projects.map((proj) => ({
        label: proj.name,
        value: proj.id,
      })),
    ];
  }, [projects]);

  // UI component: all tasks completed animation
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
          source={require("../../../assets/lottie/Trophy.json")}
          autoPlay={true}
          loop={true}
          style={{ height: 300, width: 300 }}
        />
        <Text style={[styles.emptyText, { color: theme.textColor }]}>
          You're all caught up
        </Text>
      </View>
    );
  };

  // UI component: no next tasks yet
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

  // Animate 'all completed' Lottie when nextTasks just became empty
  useEffect(() => {
    if (wasJustCompleted.current && nextTasks.length === 0) {
      setAllCompleted(true);
      Animated.timing(animOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        wasJustCompleted.current = false;
      });
    }
  }, [nextTasks.length]);

  // Reset animation state and play tumbleweed animation
  useEffect(() => {
    setAllCompleted(false);
    animOpacity.setValue(0);

    const timeout = setTimeout(() => {
      animationRef.current?.play();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatedHeaderContainer title="Next" scrollY={scrollY}>
      {/* Dropdown filters for project and context */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingRight: 16,
        }}
      >
        <CustomDropdown
          label="Project"
          selectedValue={selectedProject}
          onValueChange={(val) => setSelectedProject(val)}
          options={projectOptions}
        />
        <CustomDropdown
          label="Context"
          selectedValue={selectedContext}
          onValueChange={(val) => setSelectedContext(val)}
          options={contextOptions}
        />
      </View>

      {/* Toggle to show/hide completed tasks */}
      <View style={{ paddingVertical: 16, alignSelf: "flex-start" }}>
        <Text
          onPress={() => setShowCompleted((prev) => !prev)}
          style={[globalStyles.accent, { textAlign: "right" }]}
        >
          {showCompleted ? "Hide Completed Tasks" : "Show Completed Tasks"}
        </Text>
      </View>

      {/* Show empty/complete animation if no tasks */}
      {nextTasks.length === 0 && !showCompleted ? (
        hasAnyNextTasks || allCompleted ? (
          <AllCompletedComponent />
        ) : (
          <EmptyComponent />
        )
      ) : (
        // Render list of next tasks using SmartList
        <SmartList
          data={nextTasks}
          getKey={(task) => task.id}
          onProcessItem={(item) => markAsDone(item.id)}
          cardHeight={120}
          renderItem={(task, _anim, _onProcess) => (
            <View
              style={[
                globalStyles.card,
                {
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <View style={{ flexDirection: "column", gap: 16 }}>
                <Text style={[globalStyles.text]}>{task.title}</Text>
                {task.description ? (
                  <Text style={[globalStyles.text]}>{task.description}</Text>
                ) : null}
              </View>

              <View>
                <Text onPress={_onProcess} style={[globalStyles.accent]}>
                  Mark Done
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Completed task list (shown only if toggled on) */}
      {showCompleted && doneTasks.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={[globalStyles.heading, { marginBottom: 8 }]}>
            Completed Tasks
          </Text>
          <SmartList
            data={doneTasks}
            getKey={(task) => task.id}
            onProcessItem={() => {}}
            cardHeight={100}
            renderItem={(task) => (
              <View
                style={[
                  globalStyles.card,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    opacity: 0.5,
                  },
                ]}
              >
                <View>
                  <Text style={globalStyles.text}>{task.title}</Text>
                  {task.description ? (
                    <Text style={globalStyles.text}>{task.description}</Text>
                  ) : null}
                </View>
                <Text style={[globalStyles.text, { fontStyle: "italic" }]}>
                  Done
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </AnimatedHeaderContainer>
  );
};

export default NextActions;

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
