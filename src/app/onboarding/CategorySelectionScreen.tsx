import { displayInterests } from '@/src/constants/constants';
import { WhichInterests } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CategorySelectionScreenProps {
  onComplete: (interests: WhichInterests[]) => void;
  onSkip?: () => void;
}

export default function CategorySelectionScreen({
  onComplete,
  onSkip,
}: CategorySelectionScreenProps) {
  const [selectedInterests, setSelectedInterests] = useState<WhichInterests[]>([]);
  const [pressedInterest, setPressedInterest] = useState<WhichInterests | null>(null);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate button entrance
    buttonOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, []);

  const handleInterestToggle = (interest: WhichInterests) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleSkip = () => {
    // Select all interests and proceed
    if (onSkip) {
      onSkip();
    } else {
      onComplete(displayInterests);
    }
  };

  const handleNext = () => {
    if (selectedInterests.length >= 3) {
      onComplete(selectedInterests);
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const isNextEnabled = selectedInterests.length >= 3;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#b8f7c9', '#9ae5f6']} style={{ flex: 1 }}>
        {/* Skip Button */}
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>What are you interested in?</Text>
            <Text style={styles.subtitle}>Select 3 or more</Text>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {displayInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              const isPressed = pressedInterest === interest;
              return (
                <Pressable
                  key={interest}
                  onPress={() => handleInterestToggle(interest)}
                  onPressIn={() => setPressedInterest(interest)}
                  onPressOut={() => setPressedInterest(null)}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillSelected,
                    isPressed && styles.categoryPillPressed,
                  ]}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                    {interest}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Next Button */}
        <Animated.View style={[styles.nextButtonContainer, buttonAnimatedStyle]}>
          <Pressable
            onPress={handleNext}
            disabled={!isNextEnabled}
            style={({ pressed }) => [
              styles.nextButton,
              !isNextEnabled && styles.nextButtonDisabled,
              pressed && isNextEnabled && styles.nextButtonPressed,
            ]}
          >
            <Ionicons
              name="arrow-forward"
              size={28}
              color={isNextEnabled ? '#2c5f7c' : '#a0aec0'}
            />
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: Math.max(SCREEN_HEIGHT * 0.06, 50),
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#802525',
    fontSize: 16,
    fontFamily: 'tajawal-bold',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Math.max(SCREEN_HEIGHT * 0.12, 100),
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'faustina',
    fontWeight: '600',
    color: '#355677',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'gantari',
    fontWeight: '500',
    color: '#516b6f',
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  categoryPill: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryPillSelected: {
    backgroundColor: '#4cd964',
  },
  categoryPillPressed: {
    opacity: 0.7,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: Math.max(SCREEN_HEIGHT * 0.05, 40),
    alignSelf: 'center',
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
});
