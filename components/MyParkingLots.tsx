import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
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

  // 👉 Sự kiện đăng xuất
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

  const renderItem = ({ item }: { item: ParkingLot }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      className="bg-white rounded-2xl p-4 mb-3.5 shadow-sm"
      onPress={() => onSelectParkingLot(item.id)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-gray-900">{item.name}</Text>
        <View
          className={`flex-row items-center rounded-xl px-2 py-1 gap-1 ${
            item.status === "active" ? "bg-green-50" : "bg-yellow-50"
          }`}
        >
          <Ionicons
            name={
              item.status === "active" ? "checkmark-circle" : "time-outline"
            }
            size={14}
            color={item.status === "active" ? "#16a34a" : "#f59e0b"}
          />
          <Text
            className={`text-xs font-semibold ${
              item.status === "active" ? "text-green-800" : "text-yellow-800"
            }`}
          >
            {item.status === "active" ? "Hoạt động" : "Chờ duyệt"}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-600 mb-1">
        <Ionicons name="location-outline" size={14} color="#6b7280" />{" "}
        {item.address}
      </Text>

      <View className="flex-row items-center mt-0.5">
        <Ionicons name="car-outline" size={14} color="#1f2937" />
        <Text className="text-sm text-gray-900 ml-1">
          {item.occupiedSlots}/{item.totalSlots} chỗ
        </Text>
      </View>

      <View className="flex-row justify-end mt-2.5 gap-5">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => onEditParkingLot?.(item.id)}
        >
          <Ionicons name="create-outline" size={18} color="#2563eb" />
          <Text className="text-blue-600 text-xs ml-1 font-medium">Sửa</Text>
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
          <Ionicons name="trash-outline" size={18} color="#dc2626" />
          <Text className="text-red-600 text-xs ml-1 font-medium">Xóa</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 px-4">
      {/* Header */}
      <View className="py-5 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-indigo-950">
          Bãi đỗ của tôi
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center bg-purple-50 px-2.5 py-1.5 rounded-lg"
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#7c3aed" />
          <Text className="text-purple-600 font-semibold text-xs ml-1">
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>

      {parkingLots.length === 0 ? (
        <View className="mt-28 items-center gap-2.5">
          <Ionicons name="car-sport-outline" size={60} color="#9ca3af" />
          <Text className="text-sm text-gray-600 text-center leading-5">
            Bạn chưa có bãi đỗ nào.{"\n"}Hãy thêm bãi đỗ đầu tiên!
          </Text>
        </View>
      ) : (
        <FlatList
          data={parkingLots}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Nút thêm mới */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-purple-600 rounded-full w-14 h-14 justify-center items-center shadow-lg"
        activeOpacity={0.85}
        onPress={onAddParkingLot}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
