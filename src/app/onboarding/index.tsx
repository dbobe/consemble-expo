import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import ConsembleScreen from './ConsembleScreen';
import WelcomeScreen from './WelcomeScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingPage() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Auto transition after X seconds
    const timer = setTimeout(() => {
      transitionToNextScreen();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const transitionToNextScreen = () => {
    // Fade out current screen
    opacity.value = withTiming(
      0,
      {
        duration: 400,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      },
      (finished) => {
        if (finished) {
          // Use runOnJS to update state from UI thread
          scheduleOnRN(setCurrentScreen, 1);
          // Fade in new screen
          opacity.value = withTiming(1, {
            duration: 400,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          });
        }
      },
    );
  };

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.screen, opacityStyle]}>
        {currentScreen === 0 ? <WelcomeScreen /> : <ConsembleScreen />}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  screen: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
});
