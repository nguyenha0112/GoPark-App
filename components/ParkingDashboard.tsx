import {
  ArrowLeft,
  Car,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ParkingDashboardScreenProps {
  parkingLotName: string;
  onBack: () => void;
}

export function ParkingDashboardScreen({
  parkingLotName,
  onBack,
}: ParkingDashboardScreenProps) {
  const [tab, setTab] = useState<"overview" | "slots" | "reports">("overview");

  const stats = {
    totalRevenue: 48000000,
    todayRevenue: 1200000,
    totalSlots: 200,
    occupiedSlots: 130,
  };

  const occupancyRate = (stats.occupiedSlots / stats.totalSlots) * 100;

  const mockSlots = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    number: `A${(i + 1).toString().padStart(2, "0")}`,
    status: i % 3 === 0 ? "occupied" : i % 5 === 0 ? "reserved" : "available",
  }));

  const tabs = [
    { key: "overview", label: "Tổng quan" },
    { key: "slots", label: "Bãi đỗ" },
    { key: "reports", label: "Báo cáo" },
  ];

  return (
    <View className="flex-1 bg-gray-50">

      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-6 rounded-b-3xl">
        <TouchableOpacity
          onPress={onBack}
          className="flex-row items-center mb-3"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text className="text-white text-sm font-medium ml-2">Quay lại</Text>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold mb-1">
          {parkingLotName}
        </Text>
        <Text className="text-blue-100 text-sm">
          Quản lý và theo dõi hoạt động
        </Text>
      </View>

      {/* Tabs */}
      <View className="bg-white flex-row justify-around py-3 px-6 border-b border-gray-100">
        {tabs.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => setTab(item.key as any)}
            className={`px-4 py-2 rounded-xl ${
              tab === item.key ? "bg-blue-50" : ""
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-semibold ${
                tab === item.key ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6"
        showsVerticalScrollIndicator={false}
      >
        {tab === "overview" && (
          <>
            {/* Stats Cards */}
            <View className="flex-row gap-3 mb-4">
              <View
                className="flex-1 bg-white rounded-2xl p-4 items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center mb-2">
                  <DollarSign color="#16A34A" size={24} />
                </View>
                <Text className="text-xs text-gray-500 mb-1">
                  Doanh thu hôm nay
                </Text>
                <Text className="text-base font-bold text-gray-900">
                  {(stats.todayRevenue / 1000000).toFixed(1)}M
                </Text>
              </View>

              <View
                className="flex-1 bg-white rounded-2xl p-4 items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
                  <Users color="#3B82F6" size={24} />
                </View>
                <Text className="text-xs text-gray-500 mb-1">Đang sử dụng</Text>
                <Text className="text-base font-bold text-gray-900">
                  {stats.occupiedSlots}/{stats.totalSlots}
                </Text>
              </View>
            </View>

            {/* Occupancy Progress */}
            <View
              className="bg-white rounded-2xl p-4 mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm font-semibold text-gray-900">
                  Tỷ lệ lấp đầy
                </Text>
                <Text className="text-lg font-bold text-blue-600">
                  {Math.round(occupancyRate)}%
                </Text>
              </View>
              <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className={`h-full rounded-full ${
                    occupancyRate >= 80 ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${occupancyRate}%` }}
                />
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-xs text-gray-500">
                  Trống: {stats.totalSlots - stats.occupiedSlots}
                </Text>
                <Text className="text-xs text-gray-500">
                  Đã đỗ: {stats.occupiedSlots}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-2xl py-4 flex-row items-center justify-center"
                style={{
                  shadowColor: "#16A34A",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                activeOpacity={0.8}
              >
                <CheckCircle color="#FFFFFF" size={20} />
                <Text className="text-white font-bold text-base ml-2">
                  Check-in
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-2xl py-4 flex-row items-center justify-center"
                style={{
                  shadowColor: "#DC2626",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                activeOpacity={0.8}
              >
                <XCircle color="#FFFFFF" size={20} />
                <Text className="text-white font-bold text-base ml-2">
                  Check-out
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {tab === "slots" && (
          <>

            <Text className="text-base font-bold text-gray-900 mb-4">
              Sơ đồ bãi đỗ
            </Text>

            {/* Legend */}
            <View className="flex-row justify-around mb-4 bg-white rounded-2xl p-3">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-400 rounded-full mr-2" />
                <Text className="text-xs text-gray-600">Trống</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-red-400 rounded-full mr-2" />
                <Text className="text-xs text-gray-600">Đã đỗ</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-yellow-400 rounded-full mr-2" />
                <Text className="text-xs text-gray-600">Đặt trước</Text>
              </View>
            </View>

            {/* Slots Grid */}
            <View className="flex-row flex-wrap justify-between gap-2">
              {mockSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  className={`w-[23%] aspect-square rounded-xl items-center justify-center border-2 ${
                    slot.status === "available"
                      ? "bg-green-50 border-green-300"
                      : slot.status === "occupied"
                      ? "bg-red-50 border-red-300"
                      : "bg-yellow-50 border-yellow-300"
                  }`}
                  activeOpacity={0.7}
                >
                  <Car
                    color={
                      slot.status === "available"
                        ? "#22C55E"
                        : slot.status === "occupied"
                        ? "#EF4444"
                        : "#EAB308"
                    }
                    size={20}
                  />
                  <Text className="text-sm font-bold text-gray-900 mt-1">
                    {slot.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {tab === "reports" && (
          <>
            {/* Revenue Card */}
            <View
              className="bg-white rounded-2xl p-6 mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-purple-50 rounded-full items-center justify-center">
                  <TrendingUp color="#9333EA" size={24} />
                </View>
                <Text className="text-lg font-bold text-gray-900 ml-3">
                  Báo cáo doanh thu
                </Text>
              </View>

              <View className="border-t border-gray-100 pt-4">
                <View className="flex-row justify-between mb-3">
                  <Text className="text-sm text-gray-600">
                    Doanh thu hôm nay
                  </Text>
                  <Text className="text-base font-bold text-gray-900">
                    {stats.todayRevenue.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Tổng doanh thu</Text>
                  <Text className="text-base font-bold text-purple-600">
                    {stats.totalRevenue.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats Summary */}
            <View
              className="bg-blue-600 rounded-2xl p-6"
              style={{
                shadowColor: "#3B82F6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="text-white text-lg font-bold mb-4">
                Thống kê tháng này
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-blue-100 text-xs mb-1">
                    Trung bình/ngày
                  </Text>
                  <Text className="text-white text-xl font-bold">
                    {(stats.totalRevenue / 30 / 1000000).toFixed(1)}M
                  </Text>
                </View>
                <View>
                  <Text className="text-blue-100 text-xs mb-1">
                    Tổng lượt đỗ
                  </Text>
                  <Text className="text-white text-xl font-bold">1,240</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
