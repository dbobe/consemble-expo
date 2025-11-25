import { checkUserStreak, checkUserVibe, ConsembleAccount } from '@/src/db/jazz/schema';
import { Redirect } from 'expo-router';
import { useAccount, useIsAuthenticated } from 'jazz-tools/expo';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Page() {
  const me = useAccount(ConsembleAccount, { root: {} });
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (me?.root) {
      checkUserStreak(me.root);
      checkUserVibe(me.root);
    }
  }, [me?.root?.id]);

  if (isAuthenticated === undefined) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4ac987" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/new-quests" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
}
