import React from "react";
import { Text, View } from "react-native";

export default function StatsSection() {
  const stats = [
    { number: "1000+", label: "Bãi đỗ xe" },
    { number: "50K+", label: "Người dùng" },
    { number: "4.8★", label: "Đánh giá" },
    { number: "24/7", label: "Hỗ trợ" },
  ];

  return (
    <View className="bg-blue-600 mx-6 my-8 rounded-3xl p-8">
      <View className="flex-row justify-between items-center">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <View className="items-center">
              <Text className="text-3xl font-bold text-white mb-1">
                {stat.number}
              </Text>
              <Text className="text-sm text-blue-100">{stat.label}</Text>
            </View>
            {index < stats.length - 1 && (
              <View className="w-px h-10 bg-white/30" />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}
