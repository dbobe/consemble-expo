import { Text, View } from 'react-native';

interface QuestVibeScoreProps {
  vibeScore: number;
}

export function QuestVibeScore({ vibeScore }: QuestVibeScoreProps) {
  return (
    <View className="flex flex-col items-center h-5 text-sm">
      <Text className="bg-[rgba(65,185,123,0.81)] px-2.5 py-0.5 text-center font-gantari font-bold text-sm rounded-[30px] text-white">
        {Math.round(vibeScore * 100)}%
      </Text>
      <Text className="font-gantari font-semibold text-[10px] text-[rgba(146,148,152,1)] mt-[1px]">
        Vibe Score
      </Text>
    </View>
  );
}
