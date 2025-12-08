import { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  style?: TextStyle;
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  delay = 0,
  speed = 50,
  style,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState(text);
  const opacity = useSharedValue(0);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    // initial delay before starting typewriter effect
    const starTimeout = setTimeout(() => {
      // Fade in the text container
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.ease,
      });

      // Start typewriter effect
      const typeNextCharacter = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(typeNextCharacter, speed);
        } else if (onComplete) {
          onComplete();
        }
      };

      typeNextCharacter();
    }, delay);

    return () => {
      clearTimeout(starTimeout);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, delay, speed, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <Text style={style}>
        {displayedText}
        {displayedText.length < text.length && <Text style={{ opacity: 0.5 }}>|</Text>}
      </Text>
    </Animated.View>
  );
}
