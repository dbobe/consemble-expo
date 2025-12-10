import { QuestCard } from '@/src/components/QuestCard';
import { ConsembleAccount, QuestInteractionType } from '@/src/db/jazz/schema';
import { LinearGradient } from 'expo-linear-gradient';
import { useAccount } from 'jazz-tools/expo';
import { useMemo } from 'react';
import { SectionList, Text, View } from 'react-native';
import Animated, { Easing, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyQuestsPage() {
  const me = useAccount(ConsembleAccount, {
    resolve: {
      root: {
        questInteractions: { $each: { quest: true } },
      },
    },
  });

  const sections = useMemo(() => {
    const questInteractions = me?.$isLoaded ? me.root?.questInteractions : [];
    const active: QuestInteractionType[] = [];
    const completed: QuestInteractionType[] = [];

    for (const interaction of questInteractions) {
      if (!interaction) continue;
      if (interaction.completed) {
        completed.push(interaction);
      } else {
        active.push(interaction);
      }
    }

    // Sort completed quests by completedAt date (most recent first)
    completed.sort((a, b) => {
      const dateA = a.completedAt?.getTime() ?? 0;
      const dateB = b.completedAt?.getTime() ?? 0;
      return dateB - dateA;
    });

    return [
      { title: 'Active', data: active },
      { title: 'Completed', data: completed },
    ].filter((section) => section.data.length > 0);
  }, [me.$isLoaded, me?.root?.questInteractions]);

  return (
    <View className="flex-1 min-h-screen">
      <LinearGradient colors={['#b8f7c9', '#9ae5f6']} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          <SectionList
            ListHeaderComponent={() => (
              <View className="p-4">
                <Text className="text-2xl font-extrabold font-cabinet-grotesk text-center text-[#355677]">
                  Quests
                </Text>
              </View>
            )}
            sections={sections}
            renderItem={({ item }) => <QuestCard questInteraction={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Animated.Text
                layout={LinearTransition.duration(220).easing(Easing.ease)}
                className="font-extrabold text-[#065e73] font-cabinet-grotesk text-xl text-center my-4"
              >
                {title}
              </Animated.Text>
            )}
            keyExtractor={(item) => item.quest.$jazz.id}
            className="flex-1 mx-4"
            ItemSeparatorComponent={() => <View className="h-4" />}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
