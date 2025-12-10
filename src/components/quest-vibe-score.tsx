import { Text, View } from 'react-native';

interface QuestVibeScoreProps {
  vibeScore: number;
}

export function QuestVibeScore({ vibeScore }: QuestVibeScoreProps) {
  return (
    <View className="flex flex-col items-center">
      <Text
        className="bg-[#41b97b]/80 px-2.5 py-1 min-w-14 text-center text-sm rounded-full text-white"
        style={{ fontWeight: '800', fontFamily: 'gantari' }}
      >
        {Math.round(vibeScore * 100)}%
      </Text>
      <Text className="text-xs text-[#929498]" style={{ fontWeight: '600', fontFamily: 'gantari' }}>
        Vibe Score
      </Text>
    </View>
  );
}
