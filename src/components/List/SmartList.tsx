import React, { useRef } from "react";
import { Animated, View } from "react-native";

// Type definition for generic SmartList props
type SmartListProps<T> = {
  data: T[]; // Array of items to render
  renderItem: (
    item: T,
    animation: Animated.Value,
    onProcess: () => void
  ) => React.ReactNode; // Function to render each item
  onProcessItem: (item: T) => void; // Callback to process/remove item
  getKey: (item: T) => string; // Function to extract a unique key for each item
  cardHeight?: number; // Optional fixed height for each card
};

export default function SmartList<T>({
  data,
  renderItem,
  onProcessItem,
  getKey,
  cardHeight = 160,
}: SmartListProps<T>) {
  // Store animated values for each item by key
  const animationRef = useRef<Record<string, Animated.Value>>({});

  // Trigger animation and call onProcessItem when done
  const handleProcess = (item: T) => {
    const key = getKey(item);

    if (!animationRef.current[key]) {
      animationRef.current[key] = new Animated.Value(0);
    }

    Animated.timing(animationRef.current[key], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // Animating height & opacity; native driver not supported
    }).start(() => {
      onProcessItem(item); // Remove item from list after animation
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

        // Initialize animation ref for each item
        if (!animationRef.current[key]) {
          animationRef.current[key] = new Animated.Value(0);
        }

        const anim = animationRef.current[key];

        // Animate sliding to right
        const slideX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 400],
        });

        // Animate collapse
        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [cardHeight, 0],
        });

        // Animate fade out
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
