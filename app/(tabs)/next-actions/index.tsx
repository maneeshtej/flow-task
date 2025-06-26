import { View, Text, Animated, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AnimatedHeaderContainer from "../../../src/components/Header/AnimatedContainer";
import { useTaskStore } from "../../../src/store/taskStore";
import CustomDropdown from "../../../src/components/Dropdowns/DropdownPicker";
import { contextOptions } from "../../../src/constants/options";
import SmartList from "../../../src/components/List/SmartList";
import { GlobalStyles } from "../../../src/styles/globals";
import { Spacer } from "../../../src/components/Useful";
import LottieView from "lottie-react-native";
import { useTheme } from "../../../src/context/ThemeContext";
import { getGlobalStyles } from "../../../src/styles/GlobalStyles";
import { useProjectStore } from "../../../src/store/projectStore";

const NextActions = () => {
  const { theme } = useTheme();
  const { projects } = useProjectStore();
  const globalStyles = getGlobalStyles(theme);
  const scrollY = useRef(new Animated.Value(0)).current;

  const { tasks, updateTask } = useTaskStore();
  const [selectedContext, setSelectedContext] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  const [allCompleted, setAllCompleted] = useState(false);
  const animOpacity = useRef(new Animated.Value(0)).current;
  const wasJustCompleted = useRef(false);
  const animationRef = useRef<LottieView>(null);
  const [showCompleted, setShowCompleted] = useState(false);

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

  const hasAnyNextTasks = useMemo(() => {
    return tasks.some((task) => task.status === "next");
  }, [tasks]);

  const markAsDone = (taskId: string) => {
    updateTask(taskId, { status: "done" });
    wasJustCompleted.current = true;
  };

  const projectOptions = useMemo(() => {
    return [
      { label: "All Projects", value: "all" },
      ...projects.map((proj) => ({
        label: proj.name,
        value: proj.id,
      })),
    ];
  }, [projects]);

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

  const opacity = animOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const height = animOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const animationOpacity = animOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

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

      <View style={{ paddingVertical: 16, alignSelf: "flex-start" }}>
        <Text
          onPress={() => setShowCompleted((prev) => !prev)}
          style={[globalStyles.accent, { textAlign: "right" }]}
        >
          {showCompleted ? "Hide Completed Tasks" : "Show Completed Tasks"}
        </Text>
      </View>

      {nextTasks.length === 0 && !showCompleted ? (
        hasAnyNextTasks || allCompleted ? (
          <AllCompletedComponent />
        ) : (
          <EmptyComponent />
        )
      ) : (
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
