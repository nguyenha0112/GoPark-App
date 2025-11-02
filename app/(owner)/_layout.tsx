import { Tabs } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OwnerLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      edges={["top", "left", "right"]}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // 🚫 Ẩn hoàn toàn thanh tab
        }}
      >
        {/* Các trang của owner */}
        <Tabs.Screen
          name="management"
          options={{
            title: "Bãi đỗ của tôi",
            href: null, // Ẩn luôn tab
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            href: null, // Ẩn luôn tab
          }}
        />
        <Tabs.Screen
          name="addParkingLotPage"
          options={{
            title: "Thêm bãi đỗ",
            href: null, // Ẩn luôn tab
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
