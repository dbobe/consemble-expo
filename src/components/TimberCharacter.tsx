import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Ellipse, Path, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CHARACTER_SIZE = Math.min(SCREEN_WIDTH * 0.6, SCREEN_HEIGHT * 0.3);

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

export default function TimberCharacter() {
  const bodyRotation = useSharedValue(0);
  const armRotation = useSharedValue(0);
  const eyeScaleY = useSharedValue(1);

  useEffect(() => {
    console.log('🎬 Starting animations...');
    // Subtle sway animation (only upper body)
    bodyRotation.value = withRepeat(
      withSequence(
        withTiming(2, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(-2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    // Right arm wave animation - more pronounced wave
    armRotation.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 800 }),
          withTiming(-20, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(20, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(-20, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(20, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: 600,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, { duration: 2000 }),
        ),
        -1,
        false,
      ),
    );

    // Eye blink animation - periodic blinking
    eyeScaleY.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 3000 }), // Eyes open
          withTiming(0.1, { duration: 100, easing: Easing.ease }), // Close eyes fast
          withTiming(1, { duration: 100, easing: Easing.ease }), // Open eyes fast
          withTiming(1, { duration: 200 }), // brief pause
          withTiming(0.1, { duration: 100, easing: Easing.ease }), // Double blink
          withTiming(1, { duration: 100, easing: Easing.ease }), // Open eyes fast
          withTiming(1, { duration: 4000 }), // Longer pause
        ),
        -1,
        false,
      ),
    );
  }, []);

  const bodyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${bodyRotation.value}deg` }],
  }));

  const armAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${armRotation.value}deg` }],
  }));

  const leftEyeAnimatedProps = useAnimatedProps(() => ({
    ry: (9.28125 * eyeScaleY.value).toString(),
  }));

  const rightEyeAnimatedProps = useAnimatedProps(() => ({
    ry: (9.28125 * eyeScaleY.value).toString(),
  }));

  return (
    <View style={styles.container}>
      {/* Feet - STAYS PLANTED (outside of animated group) */}
      <View style={styles.feetContainer}>
        <Svg width={CHARACTER_SIZE} height={50} viewBox="0 0 235 50">
          <Rect x="78" y="0" width="92" height="31" rx="15.5" fill="#40b578" />
          <Rect x="92" y="10" width="64" height="31" rx="15.5" fill="#40b578" />
        </Svg>
      </View>

      {/* Upper body group - SWAYS */}
      <AnimatedView style={[styles.bodyContainer, bodyAnimatedStyle]}>
        <Svg width={CHARACTER_SIZE} height={CHARACTER_SIZE * 1.2} viewBox="0 0 235 275" fill="none">
          {/* Sprout leaf (back) */}
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M116.981 23.0339C119.413 26.6845 123.229 36.2327 120.5 47.1566L114.5 45.6559C116.718 36.7799 113.526 29.0031 111.835 26.4661L116.981 23.0339Z"
            fill="#e38e2a"
          />

          {/* Body Trunk */}
          <Path
            d="M104.445 148.487C104.828 138.133 113.329 129.938 123.684 129.938C134.04 129.938 142.54 138.133 142.923 148.487L145.518 218.57L165.189 198.889C169.095 194.981 175.428 194.981 179.334 198.889C183.24 202.797 183.24 209.133 179.334 213.041L146.528 245.864L147.506 272.267C148.005 285.776 137.195 297 123.684 297C110.173 297 99.3628 285.776 99.8629 272.267L101.755 221.147L68.9171 188.291C65.0112 184.383 65.0112 178.047 68.9171 174.139C72.8232 170.23 79.1561 170.23 83.0622 174.139L102.766 193.853L104.445 148.487Z"
            fill="#E38E2A"
          />

          {/* Left Arm */}
          <Path
            d="M0 136.125C0 119.039 13.8438 105.188 30.9211 105.188H61.8421C78.9193 105.188 92.7632 119.039 92.7632 136.125V167.062C92.7632 184.149 78.9193 198 61.8421 198H30.921C13.8438 198 0 184.149 0 167.062V136.125Z"
            fill="#43D55B"
          />

          {/* Head/Crown */}
          <Path
            d="M30.9211 86.625C30.9211 62.7042 50.3024 43.3125 74.2105 43.3125H173.158C197.066 43.3125 216.447 62.7042 216.447 86.625V123.75C216.447 147.671 197.066 167.062 173.158 167.062H74.2105C50.3024 167.062 30.9211 147.671 30.9211 123.75V86.625Z"
            fill="#47E974"
          />

          {/* Sprout leaves (front) */}
          <Path
            d="M115.704 30.9375C108.56 15.0268 123.145 3.68304 131.331 0C133.563 7.36607 133.563 23.8661 115.704 30.9375Z"
            fill="#47E974"
          />
          <Path
            d="M118.019 30.5265C100.216 33.1611 92.742 16.7643 91.2303 8.23659C99.1873 8.01506 115.685 12.1629 118.019 30.5265Z"
            fill="#43D55B"
          />

          {/* Smile */}
          <Path
            d="M145.605 120.598C130.3 135.608 110.561 132.156 98.5463 126.702C97.3005 126.137 95.5537 127.982 96.2399 129.167C101.814 138.785 108.945 151.43 128.182 147.892C139.536 145.804 145.595 131.328 147.717 121.628C147.98 120.428 146.482 119.738 145.605 120.598Z"
            fill="#149F6E"
          />

          {/* Left Eye - ANIMATED BLINK */}
          <AnimatedEllipse
            animatedProps={leftEyeAnimatedProps}
            cx="86.5789"
            cy="95.9062"
            rx="6.18421"
            ry="9.28125"
            fill="#149768"
          />

          {/* Right Eye - ANIMATED BLINK */}
          <AnimatedEllipse
            animatedProps={rightEyeAnimatedProps}
            cx="154.605"
            cy="95.9062"
            rx="6.18421"
            ry="9.28125"
            fill="#149768"
          />
        </Svg>

        {/* Right Arm - Animated Wave */}
        <AnimatedView style={[styles.armContainer, armAnimatedStyle]}>
          <Svg width={CHARACTER_SIZE * 0.38} height={CHARACTER_SIZE * 0.35} viewBox="145 145 85 85">
            <Path
              d="M160.789 173.25C160.789 159.581 171.865 148.5 185.526 148.5H210.263C223.925 148.5 235 159.581 235 173.25V198C235 211.669 223.925 222.75 210.263 222.75H185.526C171.865 222.75 160.789 211.669 160.789 198V173.25Z"
              fill="#40D057"
              transform="translate(0, -22)"
            />
          </Svg>
        </AnimatedView>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CHARACTER_SIZE,
    height: CHARACTER_SIZE * 1.34,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  feetContainer: {
    position: 'absolute',
    bottom: 0,
    width: CHARACTER_SIZE,
    height: 50,
    alignItems: 'center',
    zIndex: 10,
  },
  bodyContainer: {
    width: CHARACTER_SIZE,
    height: CHARACTER_SIZE * 1.2,
    position: 'absolute',
    bottom: 35,
    overflow: 'visible',
  },
  armContainer: {
    position: 'absolute',
    right: CHARACTER_SIZE * 0.03,
    top: CHARACTER_SIZE * 0.7,
    width: CHARACTER_SIZE * 0.38,
    height: CHARACTER_SIZE * 0.38,
    overflow: 'visible',
  },
});
