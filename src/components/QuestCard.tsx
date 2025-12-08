import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { QuestInteractionType } from '../db/jazz/schema';
import { cn } from '../lib/utils';
import { QuestVibeScore } from './quest-vibe-score';

interface QuestCardProps {
  questInteraction: QuestInteractionType;
}

const difficultyIcons = {
  easy: require('@/src/assets/easy.png'),
  medium: require('@/src/assets/medium.png'),
  hard: require('@/src/assets/hard.png'),
};

const moodIcons = [
  require('@/src/assets/sad-face.svg'),
  require('@/src/assets/okay-face.svg'),
  require('@/src/assets/happy-face.svg'),
];

export function QuestCard({ questInteraction }: QuestCardProps) {
  const difficulty = questInteraction.quest.$isLoaded ? questInteraction.quest.difficulty : 'easy';
  const isCompleted = questInteraction.completed;

  const handleCompleteQuest = () => {
    if (questInteraction.$isLoaded && !questInteraction.completed) {
      questInteraction.$jazz.set('completed', true);
      questInteraction.$jazz.set('completedAt', new Date());
    }
  };

  if (!questInteraction.$isLoaded) {
    return (
      <View className="rounded-3xl p-5 w-full shadow-sm shadow-black/10, elevation-sm">
        <ActivityIndicator size="large" color="#4ac987" />
      </View>
    );
  }

  return (
    <Animated.View
      layout={LinearTransition.duration(260).easing(Easing.ease)}
      entering={FadeInDown.duration(180)}
      exiting={FadeOutUp.duration(160)}
      sharedTransitionTag={`quest-card-${questInteraction.quest.$jazz.id}`}
      className={cn(
        'rounded-3xl p-5 w-full',
        'shadow-sm shadow-black/10, elevation-sm',
        isCompleted ? 'bg-[#d9fae9] border border-[#41b97b]' : 'bg-white',
      )}
    >
      {isCompleted ? (
        <View className="flex flex-row items-start justify-between mb-2">
          <View className="size-10 items-center justify-center">
            <Image
              source={
                moodIcons[
                  questInteraction.quest.$isLoaded ? parseInt(questInteraction.rating ?? '0') : 0
                ]
              }
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
          <View className="bg-[#349d66] rounded-full p-2 size-9 items-center justify-center">
            <FontAwesome6 name="check" size={18} color="white" />
          </View>
        </View>
      ) : (
        <View className="flex flex-row items-start justify-between mb-2">
          <QuestVibeScore
            vibeScore={questInteraction.quest.$isLoaded ? questInteraction.quest.vibeScore : 0}
          />
          <Pressable
            onPress={() => {
              handleCompleteQuest();
            }}
          >
            <View className="bg-[#349d66]/50 rounded-full p-2 size-9">
              {/* <FontAwesome6 name="check" size={20} color="white" /> */}
            </View>
          </Pressable>
        </View>
      )}
      <View className="flex flex-col items-center gap-2">
        <Text
          className="text-[#349d66] text-center text-2xl"
          style={{ fontFamily: 'faustina', fontWeight: 800 }}
        >
          {questInteraction.quest.$isLoaded ? questInteraction.quest.title : ''}
        </Text>
        <Text style={{ fontFamily: 'gantari', fontWeight: 300 }} className="text-base">
          {questInteraction.quest.$isLoaded ? questInteraction.quest.description : ''}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-10 mt-5 w-full justify-center">
        <View className="flex flex-row items-center gap-2">
          <Image
            source={require('@/src/assets/twigs.svg')}
            style={{ width: 20, height: 24 }}
            contentFit="contain"
          />
          <Text className="font-tajawal-bold font-bold text-base text-[#c07f33]">
            +{questInteraction.quest.$isLoaded ? questInteraction.quest.twigs : 0} Twigs
          </Text>
        </View>
        <View className="flex flex-row items-end gap-2">
          <Image
            source={difficultyIcons[difficulty]}
            style={{ width: 20, height: 24 }}
            contentFit="contain"
          />
          <Text
            className={cn(
              'text-base font-tajawal-bold font-bold',
              difficulty === 'easy'
                ? 'text-primary-400'
                : difficulty === 'medium'
                  ? 'text-secondary-orange-300'
                  : 'text-negative-red-300',
            )}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
