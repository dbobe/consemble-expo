import { useAccount } from "jazz-tools/expo";
import { Text, View } from "react-native";
import { ConsembleAccount } from "../db/jazz/schema";

export function JazzTest() {
  const me = useAccount(ConsembleAccount, {
    resolve: { profile: true, root: true },
  });

  if (!me) {
    return (
      <View className="p-5">
        <Text>Loading Jazz Account...</Text>
      </View>
    );
  }

  return (
    <View className="p-5">
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        ✅ Jazz is connected!
      </Text>
      <Text style={{ marginTop: 10 }}>Account ID: {me.profile?.id}</Text>
      <Text style={{ marginTop: 10 }}>
        Profile Name: {me.profile?.name || "No name yet"}
      </Text>
      <Text style={{ marginTop: 10 }}>
        Twigs Total: {me.root?.twigsTotal ?? 0}
      </Text>
      <Text style={{ marginTop: 10 }}>Streak: {me.root?.streak ?? 0}</Text>
      <Text style={{ marginTop: 10 }}>
        Vibe Meter: {me.root?.vibeMeter ?? 0}
      </Text>
    </View>
  );
}
