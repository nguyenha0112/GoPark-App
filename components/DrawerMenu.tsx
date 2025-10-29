import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  User,
  Car,
  MapPin,
  History,
  Settings,
  HelpCircle,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react-native";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
} from "react-native";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

interface DrawerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ isVisible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["token", "role", "userId"]);
            onClose();
            router.replace("/(auth)/login" as any);
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: User,
      label: "Hồ sơ của tôi",
      route: "/(tabs)/profie",
      color: "#3B82F6",
    },
    {
      icon: Car,
      label: "Xe của tôi",
      route: "/vehicles",
      color: "#10B981",
    },
    {
      icon: MapPin,
      label: "Tìm bãi đỗ",
      route: "/(tabs)/home",
      color: "#8B5CF6",
    },
    {
      icon: History,
      label: "Lịch sử đặt chỗ",
      route: "/(tabs)/history",
      color: "#F59E0B",
    },
    {
      icon: Settings,
      label: "Cài đặt",
      route: "/settings",
      color: "#6B7280",
    },
    {
      icon: HelpCircle,
      label: "Trợ giúp & Hỗ trợ",
      route: "/help",
      color: "#06B6D4",
    },
  ];

  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50"
      >
        {/* Drawer */}
        <Animated.View
          style={{ transform: [{ translateX: slideAnim }] }}
          className="absolute left-0 top-0 bottom-0 bg-white shadow-2xl"
          onStartShouldSetResponder={() => true}
        >
          <ScrollView
            className="flex-1"
            style={{ width: DRAWER_WIDTH }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="bg-gradient-to-r from-blue-600 to-indigo-600 pt-14 pb-8 px-6">
              <TouchableOpacity
                onPress={onClose}
                className="self-end mb-4 bg-white/20 rounded-full p-2"
              >
                <X size={24} color="#FFF" />
              </TouchableOpacity>

              <View className="flex-row items-center gap-4">
                <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
                  <Text className="text-white text-2xl font-bold">GP</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-xl font-bold">
                    GoPark User
                  </Text>
                  <Text className="text-white/80 text-sm">
                    user@gopark.vn
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View className="py-4">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleNavigate(item.route)}
                    className="flex-row items-center px-6 py-4 active:bg-gray-100"
                    activeOpacity={0.7}
                  >
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: item.color + "20" }}
                    >
                      <IconComponent size={20} color={item.color} />
                    </View>
                    <Text className="flex-1 text-gray-800 text-base font-medium">
                      {item.label}
                    </Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-200 mx-6 my-2" />

            {/* Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center px-6 py-4 active:bg-red-50"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mr-4">
                <LogOut size={20} color="#EF4444" />
              </View>
              <Text className="flex-1 text-red-600 text-base font-semibold">
                Đăng xuất
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View className="px-6 py-8 mt-auto">
              <Text className="text-gray-400 text-xs text-center">
                GoPark v1.0.0
              </Text>
              <Text className="text-gray-400 text-xs text-center mt-1">
                © 2025 All rights reserved
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
