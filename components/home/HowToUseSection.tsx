import React from "react";
import { Text, View } from "react-native";

export default function HowToUseSection() {
  const steps = [
    {
      number: "1",
      title: "Tìm kiếm bãi đỗ",
      description: "Tìm bãi đỗ gần bạn trên bản đồ",
    },
    {
      number: "2",
      title: "Đặt chỗ trước",
      description: "Chọn thời gian và thanh toán online",
    },
    {
      number: "3",
      title: "Check-in dễ dàng",
      description: "Quét mã QR và đỗ xe ngay",
    },
  ];

  return (
    <View className="px-6 py-16">
      <Text className="text-3xl font-bold text-gray-900 text-center mb-10">
        Cách sử dụng
      </Text>

      <View className="gap-6">
        {steps.map((step, index) => (
          <View key={index} className="flex-row gap-4">
            <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center">
              <Text className="text-white text-xl font-bold">{step.number}</Text>
            </View>

            <View className="flex-1 pt-1">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                {step.title}
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
