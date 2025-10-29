import { MapPin, Clock, Shield, Car } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

export default function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Tìm bãi đỗ dễ dàng",
      description: "Hơn 1000+ bãi đỗ xe trên toàn quốc",
      color: "#3B82F6",
    },
    {
      icon: Clock,
      title: "Đặt chỗ nhanh chóng",
      description: "Đặt chỗ chỉ trong 30 giây",
      color: "#10B981",
    },
    {
      icon: Shield,
      title: "An toàn & Bảo mật",
      description: "Thanh toán an toàn, xe được bảo hiểm",
      color: "#F59E0B",
    },
    {
      icon: Car,
      title: "Quản lý thông minh",
      description: "Theo dõi lịch sử và quản lý xe của bạn",
      color: "#8B5CF6",
    },
  ];

  return (
    <View className="bg-white py-16 px-6">
      <View className="flex-row items-center justify-center gap-2 mb-2">
        <View className="w-6 h-px bg-blue-600" />
        <Text className="text-blue-600 font-semibold text-sm">TÍNH NĂNG</Text>
        <View className="w-6 h-px bg-blue-600" />
      </View>

      <Text className="text-3xl font-bold text-gray-900 text-center mb-3">
        Tính năng nổi bật
      </Text>

      <Text className="text-base text-gray-600 text-center mb-10 leading-relaxed px-4">
        Trải nghiệm đỗ xe hiện đại và tiện lợi
      </Text>

      <View className="gap-4">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <View
              key={index}
              className="bg-gray-50 rounded-2xl p-6 flex-row items-center gap-4"
            >
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: feature.color + "20" }}
              >
                <IconComponent size={28} color={feature.color} />
              </View>

              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {feature.title}
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  {feature.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
