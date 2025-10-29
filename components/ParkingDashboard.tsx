import { LinearGradient } from "expo-linear-gradient";
import {
  Car,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
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

  const mockSlots = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    number: `A${(i + 1).toString().padStart(2, "0")}`,
    status: i % 3 === 0 ? "occupied" : i % 5 === 0 ? "reserved" : "available",
  }));

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header gradient */}
      <LinearGradient
        colors={["#7c3aed", "#6d28d9"]}
        className="rounded-b-3xl pt-14 pb-6 px-5"
      >
        <View className="gap-1.5">
          <TouchableOpacity onPress={onBack}>
            <Text className="text-indigo-100 text-sm">← Quay lại</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">
            {parkingLotName}
          </Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View className="flex-row justify-around bg-white border-b border-purple-100 py-2.5">
        {[
          { key: "overview", label: "Tổng quan" },
          { key: "slots", label: "Bãi đỗ" },
          { key: "reports", label: "Báo cáo" },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => setTab(item.key as any)}
            className={`py-1.5 px-4 rounded-full ${
              tab === item.key ? "bg-purple-100" : ""
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                tab === item.key
                  ? "text-purple-700 font-bold"
                  : "text-gray-600"
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView className="px-4 py-5" contentContainerStyle={{ gap: 20 }}>
        {tab === "overview" && (
          <>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-white rounded-2xl py-4.5 items-center shadow-sm">
                <DollarSign color="#6b21a8" size={22} />
                <Text className="text-gray-600 text-xs mt-1.5">
                  Doanh thu hôm nay
                </Text>
                <Text className="text-purple-900 text-base font-bold mt-0.5">
                  {stats.todayRevenue.toLocaleString("vi-VN")}đ
                </Text>
              </View>
              <View className="flex-1 bg-white rounded-2xl py-4.5 items-center shadow-sm">
                <Users color="#6b21a8" size={22} />
                <Text className="text-gray-600 text-xs mt-1.5">
                  Đang sử dụng
                </Text>
                <Text className="text-purple-900 text-base font-bold mt-0.5">
                  {stats.occupiedSlots}/{stats.totalSlots}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3.5 mt-2">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3.5 rounded-xl bg-green-600">
                <CheckCircle2 color="white" size={20} />
                <Text className="text-white font-semibold text-base ml-2">
                  Check-in
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3.5 rounded-xl bg-red-600">
                <XCircle color="white" size={20} />
                <Text className="text-white font-semibold text-base ml-2">
                  Check-out
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {tab === "slots" && (
          <>
            <Text className="text-base font-bold text-purple-900 mb-2.5">
              Danh sách chỗ đỗ
            </Text>
            <View className="flex-row flex-wrap justify-between gap-y-2.5">
              {mockSlots.map((slot) => (
                <View
                  key={slot.id}
                  className={`w-[22%] aspect-square rounded-xl items-center justify-center gap-1 border-2 ${
                    slot.status === "available"
                      ? "bg-green-50 border-green-300"
                      : slot.status === "occupied"
                      ? "bg-red-50 border-red-300"
                      : "bg-yellow-50 border-yellow-300"
                  }`}
                >
                  <Car
                    color={
                      slot.status === "available"
                        ? "#22c55e"
                        : slot.status === "occupied"
                        ? "#ef4444"
                        : "#eab308"
                    }
                    size={18}
                  />
                  <Text className="font-semibold text-gray-700 text-xs">
                    {slot.number}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {tab === "reports" && (
          <View className="bg-white rounded-2xl p-5 flex-row items-center gap-3 shadow-sm">
            <TrendingUp color="#6b21a8" size={22} />
            <Text className="text-gray-700 text-sm flex-1">
              Tổng doanh thu:{" "}
              <Text className="font-bold text-purple-900">
                {stats.totalRevenue.toLocaleString("vi-VN")}đ
              </Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
