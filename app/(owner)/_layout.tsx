import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import React from "react";

export default function OwnerLayout() {
  const pathname = usePathname();

  // Nếu không ở trong /dashboard → ẩn toàn bộ tab bar
  const isDashboard = pathname.includes("/dashboard");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: isDashboard
          ? {
              backgroundColor: "white",
              borderTopWidth: 1,
              borderTopColor: "#e5e7eb",
              height: 60,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 10,
            }
          : { display: "none" }, // Ẩn tab khi không ở dashboard
        tabBarActiveTintColor: "#7c3aed",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="management"
        options={{
          title: "Bãi đỗ của tôi",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          href: null,
        }}
      />
    </Tabs>
  );
}
