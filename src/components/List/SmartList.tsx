import React, { useRef } from "react";
import { Animated, View } from "react-native";

type SmartListProps<T> = {
  data: T[];
  renderItem: (
    item: T,
    animation: Animated.Value,
    onProcess: () => void
  ) => React.ReactNode;
  onProcessItem: (item: T) => void;
  getKey: (item: T) => string;
  cardHeight?: number;
};

export default function SmartList<T>({
  data,
  renderItem,
  onProcessItem,
  getKey,
  cardHeight = 160,
}: SmartListProps<T>) {
  const animationRef = useRef<Record<string, Animated.Value>>({});

  const handleProcess = (item: T) => {
    const key = getKey(item);

    if (!animationRef.current[key]) {
      animationRef.current[key] = new Animated.Value(0);
    }

    Animated.timing(animationRef.current[key], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      onProcessItem(item);
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {data.map((item) => {
        const key = getKey(item);

        if (!animationRef.current[key]) {
          animationRef.current[key] = new Animated.Value(0);
        }

        const anim = animationRef.current[key];

        const slideX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 400],
        });

        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [cardHeight, 0],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        });

        return (
          <Animated.View
            key={key}
            style={{
              height,
              opacity,
              transform: [{ translateX: slideX }],
            }}
          >
            {renderItem(item, anim, () => handleProcess(item))}
          </Animated.View>
        );
      })}
    </View>
  );
}
