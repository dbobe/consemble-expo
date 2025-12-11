import menuIcon from '@/src/assets/menu1.png';
import addIcon from '@/src/assets/menu2.png';
import vibeMeterIcon from '@/src/assets/Timber.png';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Slot, usePathname, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Layout() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Determine which screen the menu button should navigate to
  const getMenuDestination = () => {
    if (pathname === '/new-quests') {
      return '/my_quests';
    }
    return '/new-quests';
  };

  return (
    <View className="flex-1">
      {/* Gear icon at top-right */}
      {pathname !== '/account' && (
        <Pressable
          onPress={() => router.push('/account')}
          style={{
            position: 'absolute',
            top: insets.top + 16,
            right: 24,
            zIndex: 50,
          }}
        >
          <FontAwesome6 name="gear" size={24} color="#49aa64" />
        </Pressable>
      )}

      {/* Main content area - renders the current screen */}
      <Slot />

      {/* Bottom floating navigation */}
      {pathname !== '/account' && (
        <View
          style={{
            position: 'absolute',
            bottom: insets.bottom,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
          }}
        >
          <Pressable onPress={() => router.push(getMenuDestination())}>
            <Image
              source={pathname === '/new-quests' ? menuIcon : addIcon}
              style={{ width: 40, height: 40 }}
              contentFit="contain"
            />
          </Pressable>
          <Pressable onPress={() => router.push('/vibe-meter')}>
            <View
              style={{
                backgroundColor: '#14839f',
                borderRadius: 999,
                paddingVertical: 8,
                paddingHorizontal: 15,
              }}
            >
              <Image
                source={vibeMeterIcon}
                style={{ width: 40, height: 40 }}
                contentFit="contain"
              />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}
