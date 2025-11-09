import React from "react";
import { Text, View } from "react-native";

export default function FooterSection() {
  return (
    <View className="px-6 py-8 items-center border-t border-gray-200">
      <Text className="text-sm text-gray-600 mb-1">
        © 2025 GoPark. All rights reserved.
      </Text>
      <Text className="text-xs text-gray-400">
        Giải pháp đỗ xe thông minh cho người Việt
      </Text>
    </View>
  );
}
