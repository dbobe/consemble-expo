import { WhichAgeRange, WhichGender, WhichInterests, WhichScreen } from '@/src/types';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import AgeScreen from './AgeScreen';
import CategorySelectionScreen from './CategorySelectionScreen';
import ConsembleScreen from './ConsembleScreen';
import GenderScreen from './GenderScreen';
import WelcomeScreen from './WelcomeScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface OnboardingData {
  interests: WhichInterests[];
  gender: WhichGender;
  ageRange: WhichAgeRange;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentScreen, setCurrentScreen] = useState<WhichScreen>(WhichScreen.Welcome);
  const [userInterests, setUserInterests] = useState<WhichInterests[]>([]);
  const [userGender, setUserGender] = useState<WhichGender>('not set');
  const [userAgeRange, setUserAgeRange] = useState<WhichAgeRange>('not set');

  const opacity = useSharedValue(1);

  useEffect(() => {
    // Auto transition after X seconds (Only for Welcome screen)
    if (currentScreen === WhichScreen.Welcome) {
      const timer = setTimeout(() => {
        transitionToNextScreen();
      }, 3000);

      return () => clearTimeout(timer);
    }
    if (currentScreen === WhichScreen.Intro) {
      const timer = setTimeout(() => {
        transitionToNextScreen();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

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
          scheduleOnRN(setCurrentScreen, currentScreen + 1);
          // Fade in new screen
          opacity.value = withTiming(1, {
            duration: 400,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          });
        }
      },
    );
  };

  const handleCategoryComplete = (interests: WhichInterests[]) => {
    setUserInterests(interests);
    transitionToNextScreen();
  };

  const handleCategorySkip = () => {
    // Select all categories when skipped
    const allInterests: WhichInterests[] = [
      'Acts of Kindness',
      'Art',
      'Baking',
      'Beverages',
      'Cooking',
      'Crafts',
      'Exploring',
      'Family',
      'Fitness',
      'Friends',
      'Games',
      'Grilling',
      'Movies',
      'Music',
      'New People',
      'Reading',
      'Relaxation',
      'Restaurants',
      'Self Care',
      'Self Improvement',
      'Writing',
    ];
    handleCategoryComplete(allInterests);
  };

  const handleGenderComplete = (gender: WhichGender) => {
    setUserGender(gender);
    transitionToNextScreen();
  };

  const handleAgeComplete = (ageRange: WhichAgeRange) => {
    setUserAgeRange(ageRange);
    // This is the last screen - call onComplete with all data
    if (onComplete) {
      onComplete({
        interests: userInterests,
        gender: userGender,
        ageRange: userAgeRange,
      });
    }
  };

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const renderScreen = () => {
    switch (currentScreen) {
      case WhichScreen.Welcome:
        return <WelcomeScreen />;
      case WhichScreen.Intro:
        return <ConsembleScreen />;
      case WhichScreen.Category:
        return (
          <CategorySelectionScreen
            onComplete={handleCategoryComplete}
            onSkip={handleCategorySkip}
          />
        );

      case WhichScreen.Gender:
        return <GenderScreen onComplete={handleGenderComplete} />;
      case WhichScreen.Age:
        return <AgeScreen onComplete={handleAgeComplete} />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.screen, opacityStyle]}>{renderScreen()}</Animated.View>
    </View>
  );
};

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
