import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HeroSection() {
  const router = useRouter();

  return (
    <View className="relative min-h-[70vh] items-center justify-center">
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2000",
        }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.3)"]}
          className="absolute inset-0 w-full h-full"
        />
      </ImageBackground>

      {/* Content */}
      <View className="relative z-10 w-full px-6 items-center">
        <Text className="text-4xl md:text-5xl font-bold text-white text-center mb-4 leading-tight">
          Đặt Chỗ Đậu Xe Dễ Dàng,{"\n"}Mọi Lúc Mọi Nơi
        </Text>

        <Text className="text-lg text-white/90 text-center mb-8 leading-relaxed">
          Khám phá bãi đỗ xe gần bạn và đặt trước chỉ trong vài giây!
        </Text>

        {/* CTA Buttons */}
        <View className="w-full max-w-md gap-3">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="bg-white rounded-xl py-4 px-6 flex-row items-center justify-center gap-2 shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-blue-600 font-bold text-lg">Đăng nhập</Text>
            <ChevronRight size={20} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            className="bg-white/20 border-2 border-white rounded-xl py-4 px-6 items-center justify-center backdrop-blur-sm"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg">Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
