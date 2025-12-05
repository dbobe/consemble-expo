import { ConsembleAccount } from '@/src/db/jazz/schema';
import { useAccount } from 'jazz-tools/expo';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyQuestsPage() {
  const me = useAccount(ConsembleAccount, { resolve: { root: true } });
  return (
    <SafeAreaView className="flex-1">
      <Text>My Quests</Text>
      {me.$isLoaded && me?.root && <Text>{me.root.completedOnboarding ? 'true' : 'false'}</Text>}
      {me.$isLoaded && me?.root && <Text>{me.root.interestedCategories.join(', ')}</Text>}
    </SafeAreaView>
  );
}
