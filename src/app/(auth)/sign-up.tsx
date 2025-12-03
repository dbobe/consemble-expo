import { FloatingLabelInput } from '@/src/components/floating-label-input';
import { useSignUp, useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useWarmUpBrowser } from './sign-in';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  useWarmUpBrowser();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    console.log(emailAddress, password);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(tabs)/new-quests');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleGoogleSignUp = useCallback(async () => {
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

      if (createdSessionId && ssoSetActive) {
        await ssoSetActive({ session: createdSessionId });
        router.replace('/(tabs)/new-quests');
      } else {
        // No session - possible missing data
        console.log('SSO sign-up result missing session -', { ssoSignIn, ssoSignUp });
      }
    } catch (err) {
      console.error('OAuth sign-up error -', JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow, router]);

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <View className="bg-white h-full flex justify-center items-center relative">
      <View className="flex-row items-center justify-center gap-4 mb-8">
        <Image source={require('../../assets/Timber.png')} className="size-16" />
        <Text className="text-5xl text-logo-text font-cabinet-grotesk">Consemble</Text>
      </View>
      <View className="w-[90%] p-8 bg-white rounded-[30px] shadow-md z-10">
        <View className="gap-4">
          <Text className="font-gantari text-2xl font-semibold text-center text-logo-text">
            New Account
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
          <FloatingLabelInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
            secureTextEntry={true}
          />
          <TouchableOpacity
            onPress={onSignUpPress}
            className="bg-primary-200 w-full py-3 px-6 rounded-full border border-primary-300 mt-4"
          >
            <Text className="text-white text-center text-lg font-bold">Sign Up</Text>
          </TouchableOpacity>

          {/* Google Sign Up */}
          <View className="flex flex-row items-center justify-center gap-2">
            <View className="bg-neutral-gray-400 h-px w-1/3" />
            <Text className="text-neutral-gray-400 text-center text-sm font-medium">OR</Text>
            <View className="bg-neutral-gray-400 h-px w-1/3" />
          </View>
          <TouchableOpacity
            onPress={handleGoogleSignUp}
            className="bg-transparent w-full py-3 px-6 rounded-full border border-neutral-gray-400 flex flex-row items-center justify-center gap-2"
          >
            <Image source={require('@/src/assets/google-color-icon.png')} className="size-6" />
            <Text className="text-neutral-gray-400 text-center text-lg font-bold">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <Link href="/sign-in" className="mt-4">
            <Text className="text-secondary-turquoise-300 font-medium text-lg text-center">
              Back lo Login
            </Text>
          </Link>
        </View>
      </View>
      <View className="bg-[#1ece82] rounded-t-[71px] h-96 w-full absolute -bottom-16" />
    </View>
  );
}
