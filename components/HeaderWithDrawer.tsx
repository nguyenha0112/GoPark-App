import { Menu } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import DrawerMenu from "./DrawerMenu";

interface HeaderWithDrawerProps {
  title?: string;
  showTitle?: boolean;
}

export default function HeaderWithDrawer({
  title = "GoPark",
  showTitle = true,
}: HeaderWithDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
        {/* Menu Button */}
        <TouchableOpacity
          onPress={() => setIsDrawerOpen(true)}
          className="w-10 h-10 rounded-lg bg-gray-100 items-center justify-center"
          activeOpacity={0.7}
        >
          <Menu size={24} color="#374151" />
        </TouchableOpacity>

        {/* Title */}
        {showTitle && (
          <Text className="text-xl font-bold text-gray-900">{title}</Text>
        )}

        {/* Right Placeholder (for centering) */}
        <View className="w-10" />
      </View>

      {/* Drawer Menu */}
      <DrawerMenu
        isVisible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
