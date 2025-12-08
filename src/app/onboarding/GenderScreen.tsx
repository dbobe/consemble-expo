import { WhichGender } from '@/src/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GenderScreenProps {
  onComplete: (gender: WhichGender) => void;
}

const genderOptions: { value: WhichGender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
  { value: 'not set', label: 'Prefer not to say' },
];

export default function GenderScreen({ onComplete }: GenderScreenProps) {
  const [selectedGender, setSelectedGender] = useState<WhichGender>('not set');
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    containerOpacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, []);

  const handleSelect = (gender: WhichGender) => {
    setSelectedGender(gender);
    // Small delay before transition for visual feedback
    setTimeout(() => {
      onComplete(gender);
    }, 200);
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LinearGradient colors={['#b8f7c9', '#9ae5f6']} style={{ flex: 1 }}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>What is your gender?</Text>
            <Text style={styles.subtitle}>This helps personalize your experience</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {genderOptions.map((option) => {
              const isSelected = selectedGender === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                    // pressed && styles.optionButtonPressed,
                  ]}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Skip Button */}
          <Pressable onPress={() => handleSelect('not set')} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Math.max(SCREEN_HEIGHT * 0.12, 100),
    alignItems: 'center',
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
  optionsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionButtonSelected: {
    backgroundColor: '#4cd964',
  },
  optionButtonPressed: {
    opacity: 0.7,
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'gantari',
    fontWeight: '600',
    color: '#2d3748',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  skipButton: {
    marginTop: 32,
    padding: 16,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'tajawal-bold',
    fontWeight: 'bold',
    color: '#802525',
    textAlign: 'center',
  },
});
