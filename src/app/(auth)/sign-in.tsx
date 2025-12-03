import { FloatingLabelInput } from '@/src/components/floating-label-input';
import { useSignIn, useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';

// Preloads the browser for Android devices to reduce authentication load time
// See: https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  // SSO (OAuth) sign in
  const { startSSOFlow } = useSSO();

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const {
        createdSessionId,
        setActive: ssoSetActive,
        signIn: ssoSignIn,
        signUp: ssoSignUp,
      } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: 'consembleexpo',
        }),
      });

      if (createdSessionId) {
        if (ssoSetActive) {
          await ssoSetActive({ session: createdSessionId });
        }
        router.replace('/(tabs)/new-quests');
      } else {
        // Possibly missing steps (e.g. sign-up data, MFA) — inspect ssoSignIn / ssoSignUp
        console.log('SSO sign-in result missing session -', { ssoSignIn, ssoSignUp });
      }
    } catch (err) {
      console.error('OAuth sign-in error -', JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow, router]);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(tabs)/new-quests');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="bg-white h-full flex justify-center items-center relative">
      <View className="flex-row items-center justify-center gap-4 mb-8">
        <Image source={require('../../assets/Timber.png')} className="size-16" />
        <Text className="text-5xl text-logo-text font-cabinet-grotesk">Consemble</Text>
      </View>
      <View className="w-[90%] p-8 bg-white rounded-[30px] shadow-sm z-10 elevation-sm">
        <View className="gap-4">
          <Text className="font-gantari text-2xl font-semibold text-center text-logo-text">
            Welcome Back!
          </Text>
          <FloatingLabelInput
            label="Email"
            value={emailAddress}
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FloatingLabelInput
            label="Password"
            value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
          <Link href="/forgot-password" className="cursor-pointer">
            <Text className="text-secondary-turquoise-300 font-medium text-right">
              Forgot Password?
            </Text>
          </Link>
          <TouchableOpacity
            onPress={onSignInPress}
            className="bg-primary-200 w-full py-3 px-6 rounded-full border border-primary-300 mt-4"
          >
            <Text className="text-white text-center text-lg font-bold">Log In</Text>
          </TouchableOpacity>

          {/* Google Sign In */}
          <View className="flex flex-row items-center justify-center gap-2">
            <View className="bg-neutral-gray-400 h-px w-1/3" />
            <Text className="text-neutral-gray-400 text-center text-sm font-medium">OR</Text>
            <View className="bg-neutral-gray-400 h-px w-1/3" />
          </View>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            className="bg-transparent w-full py-3 px-6 rounded-full border border-neutral-gray-400 flex flex-row items-center justify-center gap-2"
          >
            <Image source={require('@/src/assets/google-color-icon.png')} className="size-6" />
            <Text className="text-neutral-gray-400 text-center text-lg font-bold">
              Continue with Google
            </Text>
          </TouchableOpacity>
          <Link href="/sign-up" className="mt-4">
            <Text className="text-secondary-turquoise-300 font-medium text-lg text-center">
              Create an Account
            </Text>
          </Link>
        </View>
      </View>
      <View className="bg-[#1ece82] rounded-t-[71px] h-96 w-full absolute -bottom-14" />
    </View>
  );
}
