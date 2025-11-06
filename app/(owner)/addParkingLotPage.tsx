// app/owner/add-parking-lot/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";
import AddParkingLotForm from "../../components/AddParkingLotForm";

export default function AddParkingLotPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.back(); // ✅ Quay lại trang danh sách sau khi tạo thành công
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <AddParkingLotForm onSuccess={handleSuccess} />
      </View>
    </SafeAreaView>
  );
}
