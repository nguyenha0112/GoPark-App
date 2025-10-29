import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ParkingDashboardScreen } from "../../components/ParkingDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();

  return (
    <ParkingDashboardScreen
      parkingLotName={name || "Dashboard bãi đỗ"}
      onBack={() => router.back()}
    />
  );
}
