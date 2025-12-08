import { ConsembleAccount } from '@/src/db/jazz/schema';
import { useRouter } from 'expo-router';
import { useAccount } from 'jazz-tools/expo';
import { useEffect } from 'react';
import { OnboardingData, OnboardingFlow } from './OnboardingFlow';

export default function OnboardingScreen() {
  const router = useRouter();
  const me = useAccount(ConsembleAccount, {
    resolve: {
      root: true,
      profile: true,
    },
  });

  useEffect(() => {
    if (me.$isLoaded && me.root?.completedOnboarding) {
      router.push('/(tabs)/new-quests');
    }
  }, [me.$isLoaded, me.root?.completedOnboarding, router]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (me?.root && me?.profile) {
      me.profile.$jazz.set('gender', data.gender);
      me.profile.$jazz.set('ageRange', data.ageRange);
      me.root.$jazz.set('interestedCategories', data.interests);
      me.root.$jazz.set('completedOnboarding', true);

      router.push('/(tabs)/new-quests');
    }
  };

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}
