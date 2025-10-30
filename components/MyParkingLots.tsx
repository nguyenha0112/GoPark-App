import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Car,
  CheckCircle,
  Clock,
  Edit3,
  LogOut,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  totalSlots: number;
  occupiedSlots: number;
  status: "active" | "pending";
}

interface MyParkingLotsScreenProps {
  parkingLots: ParkingLot[];
  onSelectParkingLot: (id: string) => void;
  onAddParkingLot: () => void;
  onEditParkingLot?: (id: string) => void;
  onDeleteParkingLot?: (id: string) => void;
}

export const MyParkingLotsScreen: React.FC<MyParkingLotsScreenProps> = ({
  parkingLots,
  onSelectParkingLot,
  onAddParkingLot,
  onEditParkingLot,
  onDeleteParkingLot,
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            router.replace("/login");
          } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ParkingLot }) => {
    const occupancyRate = (item.occupiedSlots / item.totalSlots) * 100;
    const isNearFull = occupancyRate >= 80;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
        onPress={() => onSelectParkingLot(item.id)}
      >
        {/* Header Row */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-base font-bold text-gray-900 mb-1">
              {item.name}
            </Text>
            <View className="flex-row items-center">
              <MapPin size={14} color="#6B7280" />
              <Text
                className="text-sm text-gray-600 ml-1 flex-1"
                numberOfLines={1}
              >
                {item.address}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View
            className={`flex-row items-center px-3 py-1.5 rounded-full ${
              item.status === "active" ? "bg-green-50" : "bg-amber-50"
            }`}
          >
            {item.status === "active" ? (
              <CheckCircle size={14} color="#16A34A" />
            ) : (
              <Clock size={14} color="#F59E0B" />
            )}
            <Text
              className={`text-xs font-semibold ml-1 ${
                item.status === "active" ? "text-green-700" : "text-amber-700"
              }`}
            >
              {item.status === "active" ? "Hoạt động" : "Chờ duyệt"}
            </Text>
          </View>
        </View>

        {/* Slots Info */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Car size={16} color="#3B82F6" />
            <Text className="text-sm font-semibold text-gray-900 ml-2">
              {item.occupiedSlots}/{item.totalSlots} chỗ
            </Text>
          </View>

          {/* Occupancy Bar */}
          <View className="flex-1 ml-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <View
              className={`h-full rounded-full ${
                isNearFull ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </View>
          <Text className="text-xs font-medium text-gray-500 ml-2">
            {Math.round(occupancyRate)}%
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-end gap-4 pt-3 border-t border-gray-100">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => onEditParkingLot?.(item.id)}
          >
            <Edit3 size={16} color="#3B82F6" />
            <Text className="text-sm font-semibold text-blue-600 ml-1.5">
              Sửa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={() =>
              Alert.alert("Xác nhận", "Xóa bãi đỗ này?", [
                { text: "Hủy", style: "cancel" },
                {
                  text: "Xóa",
                  style: "destructive",
                  onPress: () => onDeleteParkingLot?.(item.id),
                },
              ])
            }
          >
            <Trash2 size={16} color="#EF4444" />
            <Text className="text-sm font-semibold text-red-600 ml-1.5">
              Xóa
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-4 px-6 border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Bãi đỗ của tôi
            </Text>
            <Text className="text-m text-black font-bold mt-0.5">
              {parkingLots.length} bãi đỗ
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-red-50 px-3 py-2 rounded-xl"
            activeOpacity={0.7}
          >
            <LogOut size={18} color="#EF4444" />
            <Text className="text-sm font-semibold text-red-600 ml-2">
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {parkingLots.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Car size={48} color="#9CA3AF" strokeWidth={1.5} />
          </View>
          <Text className="text-lg font-bold text-gray-900 mb-2">
            Chưa có bãi đỗ
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            Bạn chưa có bãi đỗ nào.{"\n"}Hãy thêm bãi đỗ đầu tiên!
          </Text>
        </View>
      ) : (
        <FlatList
          data={parkingLots}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="p-6 pb-24"
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center"
        style={{
          shadowColor: "#2563EB",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        activeOpacity={0.8}
        onPress={onAddParkingLot}
      >
        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};
