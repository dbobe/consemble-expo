import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View className="flex-1">
      <NativeTabs>
        {/* <NativeTabs.Trigger name="index">
          <Icon sf="house.fill" drawable={'ic_secure'} />
          <Label>Home</Label>
        </NativeTabs.Trigger> */}
        <NativeTabs.Trigger name="new-quests">
          {/* <Icon src={require("@/src/assets/menu1.png")} /> */}
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
      </NativeTabs>
    </View>
  );
}
