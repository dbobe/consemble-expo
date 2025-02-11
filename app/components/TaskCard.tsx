import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { Task } from "../types";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
// import { Link } from "expo-router";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const translateX = useSharedValue(0);
  const cardContext = useSharedValue({ x: 0 });

  const handleVote = (direction: "left" | "right") => {
    "worklet";
    const isRight = direction === "right";
    translateX.value = withSpring(isRight ? SCREEN_WIDTH : -SCREEN_WIDTH, {
      velocity: 100,
      damping: 15,
    });
    // Here you can add your vote handling logic
    console.log(isRight ? "Upvoted" : "Downvoted");
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      cardContext.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + cardContext.value.x;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        handleVote(translateX.value > 0 ? "right" : "left");
      } else {
        translateX.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
      "clamp"
    );

    return {
      transform: [{ translateX: translateX.value }, { rotate: `${rotate}deg` }],
    };
  });

  const rNopeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 1],
      "clamp"
    );

    return {
      opacity,
    };
  });

  const rLikeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      "clamp"
    );

    return {
      opacity,
    };
  });

  return (
    // <Link href={"#"} asChild>
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[rStyle]}
        className="bg-white rounded-xl overflow-hidden shadow-sm mb-4"
      >
        <Image
          source={{ uri: task.image }}
          className="w-full h-40"
          resizeMode="cover"
        />

        {/* Vote Overlays */}
        <Animated.View
          style={[rNopeStyle]}
          className="absolute left-8 top-4 bg-red-500/80 px-6 py-2 rounded-lg rotate-[-20deg]"
        >
          <Text className="text-white font-bold text-2xl">NOPE</Text>
        </Animated.View>

        <Animated.View
          style={[rLikeStyle]}
          className="absolute right-8 top-4 bg-emerald-500/80 px-6 py-2 rounded-lg rotate-[20deg]"
        >
          <Text className="text-white font-bold text-2xl">LIKE</Text>
        </Animated.View>

        <View className="p-4">
          <Text className="text-xl font-semibold text-gray-800">
            {task.title}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">{task.description}</Text>

          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center">
              <Text className="text-gray-600">{task.category}</Text>
              <View className="flex-row items-center ml-4">
                <Text className="text-amber-500">★</Text>
                <Text className="ml-1 text-gray-600">{task.twigs} Twigs</Text>
              </View>
            </View>

            <View className="bg-emerald-100 px-3 py-1 rounded-full">
              <Text className="text-emerald-600 text-sm">
                {task.difficulty}
              </Text>
            </View>
          </View>

          {/* Vote buttons */}
          <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <View className="flex-row items-center bg-red-50 px-12 py-3 rounded-lg">
              <AntDesign name="dislike2" size={24} color="#ef4444" />
            </View>

            <View className="flex-row items-center bg-emerald-50 px-12 py-3 rounded-lg">
              <AntDesign name="like2" size={24} color="#10b981" />
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
    // </Link>
  );
}
