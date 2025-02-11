import { View, ScrollView, Text } from "react-native";
import TaskCard from "./components/TaskCard";
import { mockTasks } from "./types";

export default function Home() {
  return (
    <View className="flex-1 bg-emerald-50">
      {/* <ScrollView className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Tasks</Text>
          <Text className="text-gray-600">Complete tasks to earn twigs</Text>
        </View> */}
      <View className="w-[90%] mx-auto mt-10">
        {mockTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </View>

      {/* Feedback button */}
      <View className="absolute bottom-10 right-10">
        <View className="bg-white px-4 py-2 rounded-full flex-row items-center shadow-sm">
          <Text className="text-gray-800 mr-2">👋</Text>
          <Text className="text-gray-800">Feedback</Text>
        </View>
      </View>
      {/* </ScrollView> */}
    </View>
  );
}
