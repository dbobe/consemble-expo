import easyIcon from '@/src/assets/easy.png';
import hardIcon from '@/src/assets/hard.png';
import mediumIcon from '@/src/assets/medium.png';
import { QuestVibeScore } from '@/src/components/quest-vibe-score';
import { imageReferences } from '@/src/db/jazz/imageReferences';
import { ConsembleAccount, ListOfQuests, Quest, QuestInteraction } from '@/src/db/jazz/schema';
import { cn } from '@/src/lib/utils';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAccount, useCoState } from 'jazz-tools/expo';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { ALL_QUESTS_ID } from '../../db/jazz/quests';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const ROTATION_ANGLE = 30;

// Helprt to pick random item from array
function pickRandom<T>(arr: T[], exclude?: T): T | null {
  const filtered = exclude ? arr.filter((item) => item !== exclude) : arr;
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export default function NewQuestsPage() {
  const router = useRouter();
  const hasCheckedOnboarding = useRef(false);
  const hasMounted = useRef(false);

  const me = useAccount(ConsembleAccount, {
    resolve: {
      root: {
        questInteractions: {
          $each: { quest: true },
        },
        interestedCategories: true,
      },
    },
  });

  const allQuests = useCoState(ListOfQuests, ALL_QUESTS_ID);

  // Card stack state - stable references, no random in useMemo
  const [currentCard, setCurrentCard] = useState<Quest | null>(null);
  const [nextCard, setNextCard] = useState<Quest | null>(null);
  const [exitingCard, setExitingCard] = useState<Quest | null>(null);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('left');

  const hasSetInitialCards = useRef(false);

  // Animation values for current card (dragging)
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  // Animation values for exiting card (animates out)
  const exitTranslateX = useSharedValue(0);
  const exitRotate = useSharedValue(0);
  const exitOpacity = useSharedValue(1);

  // Animation values for next card coming forward
  const nextCardScale = useSharedValue(0.92);

  useEffect(() => {
    // Use a small delay to let Jazz finish initial sync (Claude)
    const timer = setTimeout(() => {
      hasMounted.current = true;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Verify authentication and onboarding status
  useEffect(() => {
    if (!me?.$isLoaded || !me.root || hasCheckedOnboarding.current) return;
    hasCheckedOnboarding.current = true;
    if (me.root.completedOnboarding === false) {
      router.replace('/onboarding');
    }
  }, [me?.root?.completedOnboarding, router]);

  // Derive loading state directly
  const isLoading = !allQuests || !allQuests.$isLoaded || !me || !me.$isLoaded || !me.root;

  const myQuests = Array.isArray(me?.root?.questInteractions) ? me?.root?.questInteractions : [];

  // Filter available quests
  const availableQuests = useMemo(() => {
    if (isLoading) return [];

    // Create a set of quest IDs that the user has already interacted with
    const myQuestIds = new Set(
      myQuests.map((item) => item?.quest?.$jazz?.id).filter((id): id is string => !!id),
    );

    let filteredQuests: Quest[] = [];

    if (me.root.interestedCategories && me.root.interestedCategories.length > 0) {
      const interestedCategories = me.root.interestedCategories;

      filteredQuests = allQuests.filter((quest) => {
        if (!quest) return false;

        const hasMatchingCategory = quest.categories?.some((cat) =>
          interestedCategories.includes(cat),
        );

        const notAlreadyAccepted = !myQuestIds.has(quest.$jazz?.id);

        return hasMatchingCategory && notAlreadyAccepted;
      });
    } else {
      filteredQuests = allQuests.filter((quest) => quest && !myQuestIds.has(quest.$jazz?.id));
    }

    return filteredQuests;
  }, [isLoading, allQuests, me?.root?.questInteractions, me?.root?.interestedCategories]);

  // Get persisted quest
  const persistedQuest = me?.$isLoaded ? me.root?.currentQuest : null;

  // Initialize cards - runs when we have data and haven't set initial cards yet
  useEffect(() => {
    // Skip already have a current card or no available quests
    if (currentCard || availableQuests.length === 0) return;

    // Skip if we've already initialized this mount
    if (hasSetInitialCards.current) return;

    hasSetInitialCards.current = true;

    let firstCard: Quest | null = null;

    // Try to use persisted quest if it's still available
    if (persistedQuest && availableQuests.some((q) => q.$jazz?.id === persistedQuest.$jazz?.id)) {
      firstCard = persistedQuest;
    } else {
      firstCard = pickRandom(availableQuests);
    }

    if (firstCard) {
      setCurrentCard(firstCard);
      const secondCard = pickRandom(availableQuests, firstCard);
      setNextCard(secondCard);
    }
  }, [availableQuests, persistedQuest, currentCard]);

  // Reset initialization flag when quests become empty or component unmounts
  useEffect(() => {
    return () => {
      hasSetInitialCards.current = false;
    };
  }, []);

  // Also reset if quests become empty
  useEffect(() => {
    if (availableQuests.length === 0) {
      hasSetInitialCards.current = false;
      setCurrentCard(null);
      setNextCard(null);
    }
  }, [availableQuests.length]);

  // Persist currentQuest whrn it changes
  useEffect(() => {
    if (currentCard && me?.root && hasMounted.current) {
      me.root.$jazz.set('currentQuest', currentCard);
    }
  }, [currentCard?.$jazz.id]);

  // Calculate active quests
  const activeQuestsCount = Array.isArray(me?.root?.questInteractions)
    ? me.root?.questInteractions.filter((interaction) => !interaction?.completed).length
    : 0;

  // Called when exit animation completes
  const onExitAnimationComplete = useCallback(() => {
    setExitingCard(null);
    // Reset exit animation values
    exitTranslateX.value = 0;
    exitRotate.value = 0;
    exitOpacity.value = 1;
  }, []);

  // Handle card transition
  const processSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (!currentCard || activeQuestsCount >= 5) return;

      // Handle accept or reject
      if (direction === 'right') {
        console.log('Accepting quest:', currentCard.title);
        myQuests.$jazz.push(
          QuestInteraction.create({
            quest: currentCard,
            completed: false,
            completedAt: undefined,
            rating: undefined,
          }),
        );
      } else {
        console.log('Rejecting quest:', currentCard.title);
      }

      // Move currentCard to exitingCard
      setExitingCard(currentCard);
      setExitDirection(direction);

      // Start exit animation
      const exitX = direction === 'left' ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
      const exitRotation = direction === 'left' ? -ROTATION_ANGLE : ROTATION_ANGLE;
      exitTranslateX.value = withTiming(exitX, { duration: 300 });
      exitRotate.value = withTiming(exitRotation, { duration: 300 });
      exitOpacity.value = withTiming(0, { duration: 300 }, () => {
        scheduleOnRN(onExitAnimationComplete);
      });

      // Update current card
      setCurrentCard(nextCard);

      // Animated next card forward
      nextCardScale.value = 1; // Reset instantly since it's now current

      // Reset drag position
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;

      // Pick a new nextCard from remaining available quests
      const remainingQuests = availableQuests.filter(
        (q) => q.$jazz?.id !== nextCard?.$jazz?.id && q.$jazz?.id !== currentCard?.$jazz?.id,
      );
      const newNext = pickRandom(remainingQuests);
      setNextCard(newNext);

      // Reset next card scale for animation
      nextCardScale.value = 0.92;

      // TODO: Check if this is supposed to overwrite the current quest
      // Persist new current card
      if (nextCard && me?.root && hasMounted.current) {
        me.root.$jazz.set('currentQuest', nextCard);
      }
    },
    [currentCard, nextCard, availableQuests, activeQuestsCount, myQuests],
  );

  const resetCardPosition = () => {
    'worklet';
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
    nextCardScale.value = withSpring(0.92);
  };

  // Pan/Swipe gesture
  const panGesture = Gesture.Pan()
    .enabled(activeQuestsCount < 5)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotate.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
        [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      );
      // Scale up background card as user drags
      nextCardScale.value = interpolate(
        Math.abs(event.translationX),
        [0, SWIPE_THRESHOLD],
        [0.92, 0.96],
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        scheduleOnRN(processSwipe, direction);
      } else {
        resetCardPosition();
      }
    });

  // Animated styles
  const currentCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const exitingCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: exitTranslateX.value }, { rotate: `${exitRotate.value}deg` }],
    opacity: exitOpacity.value,
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextCardScale.value }],
  }));

  // Button handlers
  const handleButtonSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (!currentCard || activeQuestsCount >= 5) return;

      // Animate current card out, then process
      const exitX = direction === 'left' ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
      const exitRot = direction === 'left' ? -ROTATION_ANGLE : ROTATION_ANGLE;

      translateX.value = withTiming(exitX, { duration: 300 });
      rotate.value = withTiming(exitRot, { duration: 300 }, () => {
        scheduleOnRN(processSwipe, direction);
      });
    },
    [currentCard, activeQuestsCount, processSwipe],
  );

  // Loading states
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4ac987" />
      </View>
    );
  }

  if (availableQuests.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl text-center text-secondary-turquoise-400 font-gantari">
          No new quests available
        </Text>
        <Text className="text-base text-neutral-gray-400 mb-6">
          {me?.root.interestedCategories && me.root.interestedCategories.length > 0
            ? "We couldn't find any new quests matching your interests. Try completing some of your current quests or updating your interests in settings."
            : "You haven't set any interests yet. Go to settings to choose categories you're interested in."}
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/my_quests')}
          className="bg-primary-200 px-6 py-3 rounded-full"
        >
          <Text className="text-white text-center font-semibold">View My Quests</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4ac987" />
      </View>
    );
  }

  // Card renderer (reusable)
  const renderCardContent = (quest: Quest, showButtons: boolean = false) => (
    <>
      <Image
        source={{
          uri: quest.imageUrl || imageReferences[quest.category] || 'https://placehold.co/400x255',
        }}
        style={{
          width: '100%',
          aspectRatio: 16 / 9,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        contentFit="cover"
      />
      <View className="p-6">
        <Text className="text-2xl font-semibold text-center mb-2 font-cabinet-grotesk text-primary-300">
          {quest.title}
        </Text>
        <Text className="text-gray-600 text-center mb-6 font-gantari">{quest.description}</Text>
        <View className="flex-row justify-center items-center gap-6 mb-8">
          {/* Twigs */}
          <View className="flex-row items-center gap-2">
            <Image
              source={require('../../assets/twigs.svg')}
              style={{ height: 20, width: 20 }}
              contentFit="contain"
            />
            <Text className="text-secondary-orange-400 font-semibold">+ {quest.twigs} Twigs</Text>
          </View>
          {/* Difficulty */}
          <View className="flex-row items-center gap-2">
            <Image
              source={
                quest.difficulty === 'easy'
                  ? easyIcon
                  : quest.difficulty === 'medium'
                    ? mediumIcon
                    : hardIcon
              }
              alt="Difficulty Icon"
              style={{ width: 16, height: 16 }}
              contentFit="contain"
            />
            <Text
              className={cn(
                'text-sm',
                quest.difficulty === 'easy'
                  ? 'text-primary-400'
                  : quest.difficulty === 'medium'
                    ? 'text-secondary-orange-300'
                    : 'text-negative-red-300',
              )}
            >
              {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
            </Text>
          </View>
          <QuestVibeScore vibeScore={quest.vibeScore} />
        </View>
        {showButtons && (
          <View className="flex-row gap-4">
            {activeQuestsCount >= 5 && (
              <View className="absolute -bottom-3 left-0 right-0 bg-[#edf8f6] max-w-full z-30 px-3 py-1 rounded-2xl opacity-90 items-center">
                <Text
                  className="text-secondary-turquoise-400 p-7 text-lg"
                  style={{ fontFamily: 'gantari', fontWeight: '600' }}
                >
                  You already have 5 active quests!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/my_quests')}
                  className="bg-primary-300 px-4 py-2 rounded-full absolute left-1/2 -translate-x-1/2 -bottom-8"
                >
                  <Text
                    className="text-black text-base"
                    style={{ fontFamily: 'gantari', fontWeight: '600' }}
                  >
                    Complete Some Quests
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              className="flex-1 bg-negative-red-200 py-4 rounded-xl items-center"
              onPress={() => handleButtonSwipe('left')}
              activeOpacity={0.8}
              disabled={activeQuestsCount >= 5}
            >
              <Text className="text-white text-3xl">✕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-primary-200 py-4 rounded-xl items-center"
              onPress={() => handleButtonSwipe('right')}
              activeOpacity={0.8}
              disabled={activeQuestsCount >= 5}
            >
              <Text className="text-white text-3xl">+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );

  const cardBaseStyle = {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  };

  return (
    <View className="flex-1">
      <LinearGradient colors={['#b8f7c9', '#9ae5f6']} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          <View>
            <Text className="text-2xl font-extrabold font-cabinet-grotesk text-center text-[#355677] mt-4">
              Quests
            </Text>
            {availableQuests.length > 0 && (
              <Text className="text-sm text-center text-neutral-gray-400">
                {availableQuests.length} new quests available
              </Text>
            )}
          </View>
          {/* Card Container */}
          <View className="flex-1 justify-center items-center">
            {/* Layer 1: Next card (background stable) */}
            {nextCard && (
              <Animated.View
                style={[
                  nextCardStyle,
                  {
                    ...cardBaseStyle,
                    position: 'absolute',
                    width: SCREEN_WIDTH - 40,
                    shadowOpacity: 0.05,
                    elevation: 2,
                  },
                ]}
              >
                {renderCardContent(nextCard)}
              </Animated.View>
            )}

            {/* Layer 2: Exiting card (animates out) */}
            {exitingCard && (
              <Animated.View
                style={[
                  exitingCardStyle,
                  {
                    ...cardBaseStyle,
                    position: 'absolute',
                    width: SCREEN_WIDTH - 32,
                    zIndex: 10,
                  },
                ]}
              >
                {renderCardContent(exitingCard)}
              </Animated.View>
            )}
            {/* Layer 3: Current card (draggable, on top) */}
            <GestureDetector gesture={panGesture}>
              {currentCard && (
                <Animated.View
                  style={[
                    currentCardStyle,
                    {
                      ...cardBaseStyle,
                      width: SCREEN_WIDTH - 32,
                      zIndex: 20,
                    },
                  ]}
                >
                  {renderCardContent(currentCard, true)}
                </Animated.View>
              )}
            </GestureDetector>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
