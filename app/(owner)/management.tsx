import { useRouter } from "expo-router";
import React, { useState } from "react";
import { MyParkingLotsScreen } from "../../components/MyParkingLots";

export default function ManagementPage() {
  const router = useRouter();

  // ✅ Fake data mẫu có ép kiểu literal
  const [parkingLots] = useState([
    {
      id: "1",
      name: "Bãi đỗ Đại học Duy Tân",
      address: "Hòa Khánh, Đà Nẵng",
      totalSlots: 200,
      occupiedSlots: 130,
      status: "active" as const,
    },
    {
      id: "2",
      name: "Bãi đỗ Nguyễn Văn Linh",
      address: "Trung tâm Đà Nẵng",
      totalSlots: 150,
      occupiedSlots: 60,
      status: "pending" as const,
    },
  ]);

  // ✅ Sửa đường dẫn router.push
  const handleSelectParkingLot = (id: string) => {
    const selectedLot = parkingLots.find((lot) => lot.id === id);
    router.push({
      pathname: "/(owner)/dashboard",
      params: { name: selectedLot?.name || "", id },
    });
  };

  const handleAddParkingLot = () => {
    console.log("Đăng ký bãi mới");
    // TODO: điều hướng tới màn hình tạo bãi mới
  };

  return (
    <MyParkingLotsScreen
      parkingLots={parkingLots}
      onSelectParkingLot={handleSelectParkingLot}
      onAddParkingLot={handleAddParkingLot}
    />
  );
}
