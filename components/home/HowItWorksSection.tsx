import { useRouter } from "expo-router";
import { Car, DollarSign, Search, PlusCircle, Smile, ChevronRight } from "lucide-react-native";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default function HowItWorksSection() {
  const router = useRouter();

  return (
    <View className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 px-6">
      {/* Header */}
      <View className="flex-row items-center justify-center gap-2 mb-2">
        <View className="w-6 h-px bg-blue-600" />
        <Text className="text-blue-600 font-semibold text-sm">GIẢI PHÁP ĐỖ XE</Text>
        <View className="w-6 h-px bg-blue-600" />
      </View>

      <Text className="text-3xl font-bold text-gray-900 text-center mb-3">
        Cách thức hoạt động
      </Text>

      <Text className="text-base text-gray-600 text-center mb-10 leading-relaxed px-4">
        Dù bạn đang tìm chỗ đậu xe hay muốn quảng bá không gian đậu xe của mình,{"\n"}
        GoPark làm mọi thứ trở nên đơn giản và tiện lợi.
      </Text>

      {/* Cards */}
      <View className="gap-6">
        {/* For Drivers */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mx-auto mb-4">
            <Car size={28} color="#2563EB" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-6">
            Dành Cho Tài Xế
          </Text>

          <View className="gap-5 mb-6">
            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 rounded-lg bg-blue-50 items-center justify-center mt-1">
                <Search size={18} color="#2563EB" />
              </View>
              <Text className="flex-1 text-gray-700 leading-6">
                Tìm kiếm các chỗ đậu xe gần đó với bản đồ trực quan
              </Text>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 rounded-lg bg-blue-50 items-center justify-center mt-1">
                <View className="w-5 h-5 rounded-full bg-blue-600 items-center justify-center">
                  <Text className="text-white text-xs font-bold">Đ</Text>
                </View>
              </View>
              <Text className="flex-1 text-gray-700 leading-6">
                Đặt chỗ đậu xe trực tuyến nhanh chóng, chỉ với vài thao tác
              </Text>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 rounded-lg bg-blue-50 items-center justify-center mt-1">
                <Smile size={18} color="#2563EB" />
              </View>
              <Text className="flex-1 text-gray-700 leading-6">
                Đậu xe dễ dàng, không căng thẳng với hướng dẫn chi tiết
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/home")}
            className="bg-blue-600 rounded-full py-3 px-6 flex-row items-center justify-center gap-2"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Tìm chỗ đậu xe
            </Text>
            <ChevronRight size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* For Parking Owners */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <View className="w-16 h-16 rounded-full bg-cyan-100 items-center justify-center mx-auto mb-4">
            <DollarSign size={28} color="#06B6D4" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-6">
            Dành Cho Chủ Bãi Đậu Xe
          </Text>

          <View className="gap-5 mb-6">
            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 rounded-lg bg-cyan-50 items-center justify-center mt-1">
                <PlusCircle size={18} color="#06B6D4" />
              </View>
              <Text className="flex-1 text-gray-700 leading-6">
                Đăng ký các chỗ đậu xe của bạn chỉ trong vài phút
              </Text>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 rounded-lg bg-cyan-50 items-center justify-center mt-1">
                <View className="w-5 h-5 rounded-full bg-cyan-600 items-center justify-center">
                  <Text className="text-white text-xs font-bold">Q</Text>
                </View>
              </View>
              <Text className="flex-1 text-gray-700 leading-6">
                Quản lý đặt chỗ và thu nhập dễ dàng với bảng điều khiển trực quan
              </Text>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 rounded-lg bg-cyan-50 items-center justify-center mt-1">
                <Smile size={18} color="#06B6D4" />
              </View>
              <Text className="flex-1 text-gray-700 leading-6">
                Thu hút nhiều khách hàng hơn và tối ưu hóa doanh thu
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(owner)/dashboard")}
            className="bg-cyan-600 rounded-full py-3 px-6 flex-row items-center justify-center gap-2"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Tham gia ngay
            </Text>
            <ChevronRight size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
