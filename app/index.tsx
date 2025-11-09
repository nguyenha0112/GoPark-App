import React, { useEffect } from "react";
import { ScrollView, StatusBar, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import HowToUseSection from "@/components/home/HowToUseSection";
import CTASection from "@/components/home/CTASection";
import FooterSection from "@/components/home/FooterSection";
import { BASE_URL } from "@/lib/api";

export default function Page() {
  const router = useRouter();
  
  useEffect(() => {
    // Debug log để kiểm tra API URL
    console.log("🔗 BASE_URL từ api.ts:", BASE_URL);
    console.log("📦 Constants.expoConfig?.extra:", Constants.expoConfig?.extra);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Debug banner - chỉ hiển thị trong development */}
      {__DEV__ && (
        <View className="bg-yellow-400 px-4 py-2">
          <Text className="text-xs font-mono text-black">
            🔗 API: {BASE_URL}
          </Text>
          <TouchableOpacity 
            onPress={() => router.push("/test-connection" as any)}
            className="mt-1"
          >
            <Text className="text-xs font-bold text-blue-700 underline">
              → Test Connection
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Hero Section với background image và CTA buttons */}
        <HeroSection />

        {/* Features Section - 4 tính năng chính */}
        <FeaturesSection />

        {/* Stats Section - Thống kê ấn tượng */}
        <StatsSection />

        {/* How It Works - Dành cho tài xế và chủ bãi */}
        <HowItWorksSection />

        {/* How To Use - 3 bước sử dụng */}
        <HowToUseSection />

        {/* CTA Section - Kêu gọi hành động */}
        <CTASection />

        {/* Footer */}
        <FooterSection />
      </ScrollView>
    </View>
  );
}
