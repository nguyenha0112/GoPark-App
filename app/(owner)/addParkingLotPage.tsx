import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";
import { AddParkingLotForm } from "../../components/AddParkingLotForm";

export default function AddParkingLotPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.back(); // quay lại trang danh sách
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <AddParkingLotForm onSuccess={handleSuccess} />
      </View>
    </SafeAreaView>
  );
}
