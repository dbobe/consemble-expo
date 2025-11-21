import { ConsembleAccount, ListOfQuests, Quest } from "@/src/db/jazz/schema";
import { cn } from "@/src/lib/utils";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAccount, useCoState } from "jazz-tools/expo";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import easyIcon from "../../assets/easy.png";
import hardIcon from "../../assets/hard.png";
import mediumIcon from "../../assets/medium.png";
import { ALL_QUESTS_ID } from "../../db/jazz/quests";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const ROTATION_ANGLE = 30;

export default function NewQuestsPage() {
  const router = useRouter();

  const me = useAccount(ConsembleAccount, {
    resolve: {
      root: {
        questInteractions: {
          $each: { quest: true },
        },
        interestedCategories: true,
        currentQuest: true,
      },
    },
  });

  console.log("me", me?.root);

  const allQuests = useCoState(ListOfQuests, ALL_QUESTS_ID);

  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<{
    id: number;
    quest: Quest;
  } | null>(null);
  const [nextCard, setNextCard] = useState<Quest | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardIdCounter = useRef(0);

  // Shared values for animation
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  // Verify authentication and onboarding status
  useEffect(() => {
    if (!me) return;

    if (me?.$jazz?.root?.get("completedOnboarding") === false) {
      router.replace("/(tabs)/vibe-meter");
    }
  }, [me]);

  //Filter available quests
  useEffect(() => {
    if (!allQuests || !Array.isArray(allQuests)) {
      setIsLoading(true);
      return;
    }
    setIsLoading(false);

    const myQuests = Array.isArray(me?.root?.questInteractions)
      ? me.root.questInteractions
      : [];

    if (
      me?.root?.interestedCategories &&
      me?.root?.interestedCategories.length > 0
    ) {
      const interestedCategories = me.root.interestedCategories;

      const filteredQuests = allQuests.filter((quest) => {
        const hasMatchingCategory = quest?.categories?.some((category) =>
          interestedCategories.includes(category),
        );

        const notAlreadyAccepted = !myQuests.some(
          (item) => item?.quest?.title === quest?.title,
        );

        return hasMatchingCategory && notAlreadyAccepted;
      });

      setAvailableQuests(filteredQuests);
    } else if (allQuests) {
      const filteredQuests = allQuests.filter(
        (quest) =>
          !myQuests.some((item) => item?.quest?.title === quest?.title),
      );
      setAvailableQuests(filteredQuests);
    } else {
      setAvailableQuests([]);
    }
  }, [allQuests, me?.root?.interestedCategories, me?.root?.questInteractions]);

  // Select actual quest
  useEffect(() => {
    if (availableQuests.length > 0 && !currentCard && !isAnimating) {
      const persistedQuest = me?.root?.currentQuest;
      let questToShow: Quest | null = null;

      if (
        persistedQuest &&
        availableQuests.some((q) => q.title === persistedQuest.title)
      ) {
        questToShow = persistedQuest;
      } else {
        questToShow =
          availableQuests[Math.floor(Math.random() * availableQuests.length)];
      }

      if (questToShow) {
        setCurrentCard({ id: cardIdCounter.current++, quest: questToShow });

        // Update persisted quest
        if (me?.root) {
          me.root.$jazz.set("currentQuest", questToShow);
        }
      }
    }
  }, [availableQuests, currentCard, isAnimating, me]);

  // Calculate active quests
  const activeQuestsCount = Array.isArray(me?.root?.questInteractions)
    ? me.root?.questInteractions.filter(
        (interaction) => !interaction?.completed,
      ).length
    : 0;

  const resetCardPosition = () => {
    "worklet";
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
    opacity.value = withTiming(1);
    scale.value = withSpring(1);
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentCard || isAnimating || activeQuestsCount >= 5) return;

    setIsAnimating(true);

    //TODO: Haptic feedback
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate card exit
    const exitX =
      direction === "left" ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
    const exitRotation =
      direction === "left" ? -ROTATION_ANGLE : ROTATION_ANGLE;

    translateX.value = withTiming(exitX, { duration: 300 });
    rotate.value = withTiming(exitRotation, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });
    scale.value = withTiming(0.8, { duration: 300 });

    // Swipe logic
    setTimeout(() => {
      if (direction === "right") {
        handleAcceptQuest();
      } else {
        handleRejectQuest();
      }

      // Reset animation values
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
      opacity.value = 1;
      scale.value = 1;

      // Use preloaded quest if available
      if (nextCard) {
        setCurrentCard({ id: cardIdCounter.current++, quest: nextCard });
        setNextCard(null);
      } else {
        setCurrentCard(null);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleAcceptQuest = () => {
    if (!currentCard || !me) return;
    // TODO: Handle quest acceptance logic
    console.log("Accepting quest:", currentCard.quest.title);
    // TODO: Haptic success feedback
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRejectQuest = () => {
    if (!currentCard || !me) return;
    // TODO: Handle quest rejection logic
    console.log("Rejecting quest:", currentCard.quest.title);
    // TODO: Haptic failure feedback
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  // Pan/Swipe gesture
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotate.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
        [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? "right" : "left";
        scheduleOnRN(handleSwipe, direction);
      } else {
        resetCardPosition();
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4ac987" />
      </View>
    );
  }

  if (availableQuests.length === 0 || !currentCard) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl text-center text-secondary-turquoise-400 font-gantari">
          No new quests available
        </Text>
        <Text className="text-base text-neutral-gray-400 mb-6">
          {me?.root.interestedCategories &&
          me.root.interestedCategories.length > 0
            ? "We couldn't find any new quests matching your interests. Try completing some of your current quests or updating your interests in settings."
            : "You haven't set any interests yet. Go to settings to choose categories you're interested in."}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/my_quests")}
          className="bg-primary-200 px-6 py-3 rounded-full"
        >
          <Text className="text-white text-center font-semibold">
            View My Quests
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <LinearGradient colors={["#b8f7c9", "#9ae5f6"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          <View>
            <Text className="text-2xl font-extrabold font-cabinet-grotesk text-center text-[#355677] mt-4">
              Quests
            </Text>
          </View>
          {/* Card Container */}
          <View className="flex-1 justify-center items-center">
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[
                  animatedCardStyle,
                  {
                    width: SCREEN_WIDTH - 32,
                    backgroundColor: "white",
                    borderRadius: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                  },
                ]}
              >
                {/* Quest Image */}
                <Image
                  source={{
                    uri:
                      currentCard?.quest?.imageUrl ||
                      "https://via.placeholder.com/400x255",
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: 16 / 9,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                  resizeMode="cover"
                />
                {/* Quest Content */}
                <View className="p-6">
                  <Text className="text-2xl font-semibold text-center mb-2 font-cabinet-grotesk">
                    {currentCard?.quest?.title}
                  </Text>
                  <Text className="text-gray-600 text-center mb-6 font-gantari">
                    {currentCard?.quest?.description}
                  </Text>
                  {/* Quest info */}
                  <View className="flex-row justify-center items-center gap-6 mb-8">
                    {/* Twigs */}
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={require("../../assets/twigs.svg")}
                        height={20}
                        width={20}
                        contentFit="contain"
                      />
                      <Text className="text-secondary-orange-400 font-semibold">
                        + {currentCard?.quest?.twigs} Twigs
                      </Text>
                    </View>
                    {/* Difficulty */}
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={
                          currentCard.quest.difficulty === "easy"
                            ? easyIcon
                            : currentCard.quest.difficulty === "medium"
                              ? mediumIcon
                              : hardIcon
                        }
                        alt="Difficulty Icon"
                        width={16}
                        height={16}
                        contentFit="contain"
                      />
                      <Text
                        className={cn(
                          "text-sm",
                          currentCard.quest.difficulty === "easy"
                            ? "text-primary-400"
                            : currentCard.quest.difficulty === "medium"
                              ? "text-secondary-orange-300"
                              : "text-negative-red-300",
                        )}
                      >
                        {currentCard?.quest?.difficulty
                          .charAt(0)
                          .toUpperCase() +
                          currentCard?.quest?.difficulty.slice(1)}
                      </Text>
                    </View>
                  </View>
                  {/* Action Buttons */}
                  <View className="flex-row gap-4">
                    <TouchableOpacity
                      onPress={() => handleSwipe("left")}
                      className="flex-1 bg-negative-red-200 py-4 rounded-xl items-center"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white text-3xl">✕</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleSwipe("right")}
                      className="flex-1 bg-primary-200 py-4 rounded-xl items-center"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white text-3xl">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </GestureDetector>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
