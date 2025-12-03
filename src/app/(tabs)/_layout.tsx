import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View className="flex-1">
      {/* <NativeTabs>
        <NativeTabs.Trigger name="new-quests">
          <Icon sf={{ default: 'menucard', selected: 'menucard.fill' }} />
          <Label hidden />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="vibe-meter">
          <Icon sf={{ default: 'powermeter', selected: 'powermeter' }} />
          <Label hidden />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="account">
          <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
          <Label hidden />
        </NativeTabs.Trigger>
      </NativeTabs> */}
      <Tabs initialRouteName="new-quests" screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="new-quests" options={{ title: 'New Quests' }} />
        <Tabs.Screen name="my_quests" options={{ title: 'My Quests' }} />
        <Tabs.Screen name="account" options={{ title: 'Account' }} />
        <Tabs.Screen name="vibe-meter" options={{ title: 'Vibe Meter', href: null }} />
        <Tabs.Screen name="index" options={{ title: 'Home', href: null }} />
      </Tabs>
    </View>
  );
}
