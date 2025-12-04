import TimberCharacter from '@/src/components/TimberCharacter';
import TypewriterText from '@/src/components/TypewriterText';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ConsembleScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <TypewriterText
            text="I'm Timber, your virtual guide..."
            delay={200}
            speed={50}
            style={styles.introText}
          />
          <TypewriterText
            text="Let's Consemble!"
            delay={2500}
            speed={60}
            style={styles.consembleText}
          />
        </View>
        <TimberCharacter />
      </View>

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
  textContainer: {
    marginBottom: SCREEN_HEIGHT * 0.04,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  introText: {
    fontSize: 24,
    fontFamily: 'gantari',
    fontWeight: '600',
    color: '#355677',
    textAlign: 'center',
    opacity: 1,
  },
  consembleText: {
    fontSize: 36,
    fontFamily: 'faustina',
    fontWeight: '800',
    color: '#355677',
    marginTop: SCREEN_HEIGHT * 0.02,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: -150,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: '#1ece82',
    height: 300,
    borderRadius: 71,
    width: '100%',
  },
});
