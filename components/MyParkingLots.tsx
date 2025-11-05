import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ParkingLot = {
  _id: string;
  name: string;
  address: string;
  totalSlots: number;
  occupiedSlots: number;
  status: string;
};

interface Props {
  parkingLots: ParkingLot[];
  onSelectParkingLot: (id: string) => void;
  onAddParkingLot: () => void;
  onLogout: () => void; // thêm callback đăng xuất
}

export const MyParkingLotsScreen: React.FC<Props> = ({
  parkingLots,
  onSelectParkingLot,
  onAddParkingLot,
  onLogout,
}) => {
  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {

          await AsyncStorage.multiRemove(["token", "role", "userId"]);
          onLogout();
        },
      },
    ]);
  };


  return (
    <SafeAreaView className="flex-1 bg-blue-600">
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      {/* Header */}
      <View className="px-5 py-4 bg-blue-600 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-white">Bãi đỗ của tôi</Text>
          <Text className="text-blue-100 text-sm mt-1">
            Quản lý các bãi đỗ bạn đang sở hữu
          </Text>
        </View>

        {/* Nút đăng xuất */}
        <TouchableOpacity

          className="bg-blue-500/40 p-2 rounded-full"
          activeOpacity={0.8}
          onPress={handleLogout}
        >

          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh sách bãi đỗ */}
      <View className="flex-1 bg-gray-50 rounded-t-3xl px-4 pt-4 -mt-3">
        <FlatList
          data={parkingLots}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const percent = Math.round(
              (item.occupiedSlots / item.totalSlots) * 100
            );

            return (
              <TouchableOpacity
                className="bg-white p-4 mb-3 rounded-2xl shadow-sm border border-gray-100"
                onPress={() => onSelectParkingLot(item._id)}
                activeOpacity={0.85}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name="car-outline" size={22} color="#2563eb" />
                  <Text className="ml-2 text-base font-semibold text-gray-800">
                    {item.name}
                  </Text>
                </View>

                <Text className="text-gray-600 mb-1 text-sm">
                  {item.address}
                </Text>

                <View className="h-2 bg-gray-200 rounded-full mt-1 mb-1">
                  <View
                    style={{
                      width: `${percent}%`,
                      backgroundColor: percent > 80 ? "#ef4444" : "#2563eb",
                    }}
                    className="h-2 rounded-full"
                  />
                </View>

                {/* <View className="flex-row justify-between mt-2">
                  <Text className="text-gray-500 text-xs">
                    {item.occupiedSlots}/{item.totalSlots} chỗ
                  </Text>
                  <Text
                    className={`text-xs font-medium ${
                      percent > 80 ? "text-red-500" : "text-blue-600"
                    }`}
                  >
                    {percent}% đầy
                  </Text>
                </View> */}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-6">
              Chưa có bãi đỗ nào
            </Text>
          }
        />
      </View>

      {/* Floating button thêm bãi đỗ */}
      <TouchableOpacity

        className="absolute bottom-8 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.9}
        onPress={onAddParkingLot}
        style={{
          shadowColor: "#2563EB",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
