import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";
import EditParkingLotForm from "../../components/EditParkingLotForm";

export default function EditParkingLotPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleSuccess = () => {
    router.back(); // quay lại trang danh sách
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <EditParkingLotForm id={id as string} onSuccess={handleSuccess} />
      </View>
    </SafeAreaView>
  );
}
