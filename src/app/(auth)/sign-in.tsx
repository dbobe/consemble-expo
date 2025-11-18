import { FloatingLabelInput } from "@/src/components/floating-label-input";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

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
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
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
        <Image
          source={require("../../assets/Timber.png")}
          className="size-16"
        />
        <Text className="text-5xl text-logo-text font-cabinet-grotesk">
          Consemble
        </Text>
      </View>
      <View className="w-[90%] p-8 bg-white rounded-[30px] shadow-sm z-10">
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
            <Text className="text-white text-center text-lg font-bold">
              Log In
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
