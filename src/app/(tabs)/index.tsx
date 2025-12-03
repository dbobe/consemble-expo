import { ActivityIndicator, View } from 'react-native';

export default function Page() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#4ac987" />
    </View>
  );
}
