import { useRouter } from "expo-router";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default function CTASection() {
  const router = useRouter();

  return (
    <View className="bg-gray-50 mx-6 my-8 rounded-3xl p-8 items-center">
      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
        Sẵn sàng trải nghiệm?
      </Text>

      <Text className="text-base text-gray-600 text-center mb-6 leading-6">
        Tham gia cùng hàng ngàn người dùng đang tin dùng GoPark
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/register")}
        className="bg-blue-600 rounded-xl py-4 px-8 w-full items-center shadow-lg"
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-lg">
          Bắt đầu ngay - Miễn phí
        </Text>
      </TouchableOpacity>
    </View>
  );
}
