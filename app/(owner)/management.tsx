import { getMyParkingLots } from "@/lib/parkingLot.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { MyParkingLotsScreen } from "../../components/MyParkingLots";

export default function ManagementPage() {
  const [parkingLots, setParkingLots] = useState([]);
  const router = useRouter();

  // 🟢 Hàm tải danh sách bãi đỗ
  const fetchLots = useCallback(async () => {
    try {
      const data = await getMyParkingLots();
      setParkingLots(data || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy bãi đỗ:", err);
    }
  }, []);

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  // 🟢 Chọn bãi đỗ để vào dashboard
  const handleSelectParkingLot = (id: string) => {
    router.push(`/dashboard?id=${id}`);
  };

  // 🟢 Thêm bãi đỗ mới
  const handleAddParkingLot = () => {
    router.push({
    pathname: '/(owner)/addParkingLotPage'
  } as any);
  };

  // 🟢 Đăng xuất
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "role", "userId"]);
      router.replace("/login"); // quay về trang đăng nhập
    } catch (err) {
      console.error("❌ Lỗi khi đăng xuất:", err);
    }
  };

  return (
    <MyParkingLotsScreen
      parkingLots={parkingLots}
      onSelectParkingLot={handleSelectParkingLot}
      onAddParkingLot={handleAddParkingLot}
      onLogout={handleLogout}
    />
  );
}
