import TimberCharacter from '@/src/components/TimberCharacter';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <TimberCharacter />
      </View>

      {/* Animated button at bottom */}
      <View style={styles.buttonContainer}>
        <View style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: SCREEN_HEIGHT * 0.14,
  },
  welcomeText: {
    fontFamily: 'faustina',
    fontSize: 48,
    fontWeight: '800',
    color: '#ab6f29',
    marginBottom: SCREEN_HEIGHT * 0.04,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: -150,
    left: 0,
    right: 0,
    // paddingHorizontal: 16,
    // paddingBottom: Math.max(SCREEN_HEIGHT * 0.05, 40),
  },
  button: {
    backgroundColor: '#1ece82',
    height: 300,
    borderRadius: 71,
    width: '100%',
  },
});
