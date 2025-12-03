import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingPage() {
  const router = useRouter();
  return (
    <View className="flex-1">
      <LinearGradient colors={['#b8f7c9', '#9ae5f6']} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          <View>
            <Text className="text-2xl font-extrabold font-cabinet-grotesk text-center text-[#355677] mt-4">
              Onboarding
            </Text>
          </View>
          <Button title="Continue" onPress={() => router.replace('/(tabs)/new-quests')} />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
