import { deleteParkingLot, getMyParkingLots } from "@/lib/parkingLot.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert } from "react-native";
import { MyParkingLotsScreen } from "../../components/MyParkingLots";

export default function ManagementPage() {
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🟢 Hàm tải danh sách bãi đỗ
  const fetchLots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyParkingLots();
      setParkingLots(data || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy bãi đỗ:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🟢 Tự động reload mỗi khi quay lại màn hình này
  useFocusEffect(
    useCallback(() => {
      fetchLots();
    }, [fetchLots])
  );

  // 🟢 Chọn bãi đỗ để vào dashboard
  const handleSelectParkingLot = (id: string) => {
    router.push(`/dashboard?id=${id}`);
  };

  // 🟢 Thêm bãi đỗ mới
  const handleAddParkingLot = () => {
    router.push("/addParkingLotPage");
  };

  // 🟡 Sửa bãi đỗ
  const handleEditParkingLot = (id: string) => {
    router.push(`/editParkingLotPage?id=${id}`);
  };

  // 🔴 Xóa bãi đỗ
  const handleDeleteParkingLot = async (id: string) => {
    try {
      await deleteParkingLot(id);
      Alert.alert("🗑️ Thành công", "Đã xóa bãi đỗ!");
      fetchLots(); // refresh danh sách
    } catch (err) {
      Alert.alert("❌ Lỗi", "Không thể xóa bãi đỗ này!");
      console.error(err);
    }
  };

  // 🟢 Đăng xuất
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "role", "userId"]);
      router.replace("/login");
    } catch (err) {
      console.error("❌ Lỗi khi đăng xuất:", err);
    }
  };

  return (
    <MyParkingLotsScreen
      parkingLots={parkingLots}
      onSelectParkingLot={handleSelectParkingLot}
      onAddParkingLot={handleAddParkingLot}
      onEditParkingLot={handleEditParkingLot}
      onDeleteParkingLot={handleDeleteParkingLot}
      onLogout={handleLogout}
    />
  );
}
