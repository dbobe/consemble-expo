import CategorySelection from '@/src/components/category-selection';
import { DropdownPicker } from '@/src/components/ui/DropdownPicker';
import { genderOptions } from '@/src/constants/constants';
import { ALL_QUESTS_ID } from '@/src/db/jazz/quests';
import { ConsembleAccount, ListOfQuests } from '@/src/db/jazz/schema';
import { WhichGender } from '@/src/types';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAccount, useCoState, useIsAuthenticated, useLogOut } from 'jazz-tools/expo';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountPage() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [tempFirstName, setTempFirstName] = useState<string>('');
  const [tempLastName, setTempLastName] = useState<string>('');
  const [genderValue, setGenderValue] = useState<WhichGender>('not set');
  const [tempGenderValue, setTempGenderValue] = useState<WhichGender>('not set');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const logOut = useLogOut();
  const me = useAccount(ConsembleAccount, {
    resolve: {
      root: {
        interestedCategories: {
          $each: true,
        },
      },
      profile: true,
    },
  });

  const allQuests = useCoState(ListOfQuests, ALL_QUESTS_ID);
  // const isAdmin = allQuests && me?.canWrite(allQuests);
  const isAdmin = (allQuests && me?._permissionsForUser?.(allQuests)?.includes('write')) ?? false;

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated === true && me.$isLoaded && me.profile) {
      setFirstName(me.profile.preferredFirstName);
      setLastName(me.profile.preferredLastName);
      setGenderValue(me.profile.gender as WhichGender);
    }
  }, [isAuthenticated, me.$isLoaded, me?.profile]);

  if (isAuthenticated === undefined) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4ac987" />
      </View>
    );
  }

  const handleLogout = async () => {
    await logOut();
  };

  const handleEditPress = () => {
    setTempFirstName(firstName);
    setTempLastName(lastName);
    setTempGenderValue(genderValue);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    setFirstName(tempFirstName);
    setLastName(tempLastName);
    setGenderValue(tempGenderValue);
    me.profile?.$jazz.set('preferredFirstName', tempFirstName);
    me.profile?.$jazz.set('preferredLastName', tempLastName);
    me.profile?.$jazz.set('gender', tempGenderValue);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <View className="flex-1 ">
      <LinearGradient colors={['#b8f7c9', '#9ae5f6']} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 min-h-screen -pb-safe-offset-20">
          <View className="flex flex-1 flex-col gap-8">
            <View className="relative">
              <View className="absolute left-0 -top-20 bottom-0 w-full bg-primary-200 h-40 rounded-b-[40px] z-0 shadow-sm" />
              <View className="flex flex-row items-center justify-between px-8 z-10 mt-6">
                <TouchableOpacity onPress={() => router.back()}>
                  <FontAwesome6 name="arrow-left" size={16} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-center">Account</Text>
                <View className="size-4" />
              </View>
            </View>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-4 flex flex-col items-center w-full">
                {/* Display Name Section */}
                <View className="flex w-full flex-row items-center justify-between gap-2 my-5">
                  <View className="w-8" />
                  <View className="flex-1">
                    <Text className="text-2xl font-medium text-center">
                      {firstName} {lastName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleEditPress}
                    className="rounded-full p-2 border border-gray-300"
                  >
                    <FontAwesome6 name="pencil" size={16} color="black" />
                  </TouchableOpacity>
                </View>
                <View className="flex w-full flex-col gap-2">
                  <Text className="font-tajawal-regular text-base">Email</Text>
                  <TextInput
                    value={me?.profile?.preferredEmail ?? ''}
                    className="bg-white/50 rounded-md p-3 text-base text-gray-600 font-tajawal-regular"
                    editable={false}
                  />
                </View>
                <View className="flex w-full flex-col gap-2">
                  <Text className="font-tajawal-regular text-base">Password</Text>
                  <TextInput
                    value={me?.profile?.password ?? '********'}
                    className="bg-white/50 rounded-md p-3 text-base text-gray-600 font-tajawal-regular"
                    editable={false}
                    secureTextEntry={true}
                  />
                </View>
                <View className="flex w-full flex-col gap-2">
                  <Text className="font-tajawal-regular text-base">Gender</Text>
                  <TextInput
                    value={genderOptions[genderValue]}
                    className="bg-white/50 rounded-md p-3 text-base text-gray-600 font-tajawal-regular"
                    editable={false}
                  />
                </View>
                <TouchableOpacity
                  className="border border-primary-500 w-full rounded-lg py-2.5 px-5 mt-8 mx-4"
                  onPress={handleLogout}
                >
                  <Text className="font-tajawal-regular text-center text-2xl text-primary-500">
                    Logout
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="mt-8">
                  <View className="flex flex-row items-center gap-4">
                    <FontAwesome6 name="user-xmark" size={16} color="#961e1e" />
                    <Text className="font-tajawal-regular text-base text-[#961e1e]">
                      Delete Account
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="w-96 border-t border-[#99d8bd] mt-3 mx-auto" />

              {/* Preferred Categories */}
              <CategorySelection
                userInterests={me.root?.interestedCategories ?? []}
                setUserInterests={(selectedCat) => {
                  me.root?.$jazz.set('interestedCategories', selectedCat);
                }}
              />
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Bottom sheet modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <Pressable onPress={handleCancel} className="flex-1 justify-end bg-black/50">
          <Pressable
            className="bg-white rounded-t-3xl p-6 pb-8"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex flex-col gap-4">
              <View className="flex flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold">Edit Profile</Text>
                <TouchableOpacity onPress={handleCancel}>
                  <FontAwesome6 name="xmark" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="gap-4">
                <View>
                  <Text className="text-sm font-medium text-gray-600 mb-2">First Name</Text>
                  <TextInput
                    value={tempFirstName}
                    onChangeText={setTempFirstName}
                    placeholder="Enter your first name"
                    className="border border-gray-300 rounded-lg p-3 text-base"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-600 mb-2">Last Name</Text>
                  <TextInput
                    value={tempLastName}
                    onChangeText={setTempLastName}
                    placeholder="Enter your last name"
                    className="border border-gray-300 rounded-lg p-3 text-base"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-600 mb-2">Gender</Text>
                  <DropdownPicker
                    onValueChange={(itemValue: WhichGender) => setTempGenderValue(itemValue)}
                    items={Object.entries(genderOptions).map(([key, value]) => ({
                      label: value,
                      value: key,
                    }))}
                    value={tempGenderValue}
                    className="border border-gray-300 rounded-lg p-3 text-base"
                  />
                </View>
              </View>

              <View className="flex flex-row gap-3 mt-4">
                <TouchableOpacity
                  onPress={handleCancel}
                  className="flex-1 border border-gray-300 rounded-lg py-3"
                >
                  <Text className="text-center text-base font-semibold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  className="flex-1 bg-primary-200 rounded-lg py-3"
                >
                  <Text className="text-center text-base font-semibold text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
