import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Swipeable } from "react-native-gesture-handler";

type Props = {
  title: string;
  onDelete: () => void;
};

const TaskCard = ({ title, onDelete }: Props) => {
  const renderRightActions = () => {
    return (
      <TouchableOpacity>
        <Text>Delete</Text>
      </TouchableOpacity>
    );
  };
  return <Swipeable></Swipeable>;
};

export default TaskCard;
