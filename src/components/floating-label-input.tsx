import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "../lib/utils";

export interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  secureTextEntry?: boolean;
}

export const FloatingLabelInput = React.forwardRef<
  TextInput,
  FloatingLabelInputProps
>(
  (
    {
      label,
      className,
      secureTextEntry = false,
      value,
      onChangeText,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const hasValue = value != null && value !== undefined && value !== "";
    const isFloating = isFocused || hasValue;

    // Shared value for animation (0 = not floating, 1 = floating)
    const floatingProgress = useSharedValue(isFloating ? 1 : 0);

    //Update animation when floating state changes
    React.useEffect(() => {
      floatingProgress.value = withTiming(isFloating ? 1 : 0, {
        duration: 300,
      });
    }, [isFloating, floatingProgress]);

    // Animated styles for the label
    const labelAnimatedStyle = useAnimatedStyle(() => {
      // Interpolate top position: 0 = center (50%), 1 = top (4px)
      const top = interpolate(floatingProgress.value, [0, 1], [50, -12]);

      // Interpolate font size: 0 = base (16px), 1 = small (12px)
      const fontSize = interpolate(floatingProgress.value, [0, 1], [16, 12]);

      // Interpolate translateY: 0 = -10px (centered), 1 = 0 (top)
      const translateY = interpolate(floatingProgress.value, [0, 1], [-8, 0]);

      return {
        top: `${top}%`,
        fontSize,
        transform: [{ translateY }],
      };
    });

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChangeText = (text: string) => {
      onChangeText?.(text);
    };

    return (
      <View className="relative w-full">
        <TextInput
          ref={ref}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          className={cn(
            "peer w-full rounded-lg border border-gray-300 bg-white px-4 pb-2 pt-6 text-base",
            "focus:border-[#1ece82] focus:ring-2 focus:ring-[#1ece82]/20",
            className,
          )}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        <Animated.Text
          style={[
            {
              position: "absolute",
              left: 16,
              color: isFloating ? "#4b5563" : "#9ca3af",
              backgroundColor: isFloating ? "white" : "transparent",
              paddingHorizontal: isFloating ? 4 : 0,
              pointerEvents: "none",
            },
            labelAnimatedStyle,
          ]}
        >
          {label}
        </Animated.Text>
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <FontAwesome6
              name={showPassword ? "eye-slash" : "eye"}
              size={22}
              color="#14839f"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

FloatingLabelInput.displayName = "FloatingLabelInput";
