import { View, Text, Animated } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import AnimatedHeaderContainer from "../../../src/components/Header/AnimatedContainer";
import { useTaskStore } from "../../../src/store/taskStore";
import CustomDropdown from "../../../src/components/Dropdowns/DropdownPicker";
import { contextOptions, projectOptions } from "../../../src/constants/options";
import SmartList from "../../../src/components/List/SmartList";
import { AccentStyles, GlobalStyles } from "../../../src/styles/globals";
import { Spacer } from "../../../src/components/Useful";

const NextActions = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const { tasks, updateTask } = useTaskStore();
  const [selectedContext, setSelectedContext] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");

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

  const markAsDone = (taskId: string) => {
    updateTask(taskId, { status: "done" });
  };

  return (
    <AnimatedHeaderContainer title="Next" scrollY={scrollY}>
      <View style={{ flexDirection: "row", gap: 16 }}>
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
      <Spacer height={16} />
      {nextTasks.length === 0 ? (
        <Text>Nothing to do</Text>
      ) : (
        <SmartList
          data={nextTasks}
          getKey={(task) => task.id}
          onProcessItem={(item) => markAsDone(item.id)}
          cardHeight={120}
          renderItem={(task, _anim, _onProcess) => (
            <View
              style={[
                GlobalStyles.minimalCard,
                {
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <View style={{ flexDirection: "column", gap: 16 }}>
                <Text>{task.title}</Text>
                {task.description ? <Text>{task.description}</Text> : null}
              </View>

              <View>
                <Text
                  onPress={_onProcess}
                  style={{ color: AccentStyles.accentColor }}
                >
                  Mark Done
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </AnimatedHeaderContainer>
  );
};

export default NextActions;
