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
  Lock,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
import { BASE_URL } from "@/lib/api";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

interface DrawerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ isVisible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [userName, setUserName] = useState('GoPark User');
  const [userEmail, setUserEmail] = useState('user@gopark.vn');
  const [userRole, setUserRole] = useState('user');

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      loadUserInfo();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const loadUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('role');
      
      if (role) {
        setUserRole(role);
      }

      if (token) {
        const response = await fetch(`${BASE_URL}/api/v1/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.userName || 'GoPark User');
          setUserEmail(userData.email || 'user@gopark.vn');
        }
      }
    } catch (error) {
      console.log('Error loading user info:', error);
    }
  };

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
      route: "/profile",
      color: "#22c55e",
      bgColor: "#f0fdf4",
    },
    {
      icon: Car,
      label: "Xe của tôi",
      route: "/vehicles",
      color: "#22c55e",
      bgColor: "#f0fdf4",
    },
    {
      icon: MapPin,
      label: "Tìm bãi đỗ",
      route: "/(tabs)/home",
      color: "#22c55e",
      bgColor: "#f0fdf4",
    },
    {
      icon: History,
      label: "Lịch sử đặt chỗ",
      route: "/(tabs)/history",
      color: "#22c55e",
      bgColor: "#f0fdf4",
    },
    {
      icon: Lock,
      label: "Đổi mật khẩu",
      route: "/change-password",
      color: "#6B7280",
      bgColor: "#F3F4F6",
    },
    {
      icon: Settings,
      label: "Cài đặt",
      route: "/settings",
      color: "#6B7280",
      bgColor: "#F3F4F6",
    },
    {
      icon: HelpCircle,
      label: "Trợ giúp & Hỗ trợ",
      route: "/help",
      color: "#3B82F6",
      bgColor: "#EFF6FF",
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
            <View className="bg-green-500 pt-14 pb-8 px-6">
              <TouchableOpacity
                onPress={onClose}
                className="self-end mb-4 bg-white/20 rounded-full p-2"
              >
                <X size={24} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleNavigate('/profile')}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-16 h-16 rounded-full bg-white items-center justify-center shadow-lg">
                    <User size={32} color="#22c55e" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-xl font-bold">
                      {userName}
                    </Text>
                    <Text className="text-white/90 text-sm mb-1">
                      {userEmail}
                    </Text>
                    <View className="bg-white/20 px-2 py-1 rounded-full self-start">
                      <Text className="text-white text-xs font-semibold">
                        {userRole === 'user' ? '👤 Người dùng' : userRole === 'owner' ? '🏢 Chủ bãi' : '👑 Admin'}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#FFF" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View className="py-2">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleNavigate(item.route)}
                    className="flex-row items-center px-6 py-3 active:bg-gray-50"
                    activeOpacity={0.7}
                  >
                    <View
                      className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      <IconComponent size={22} color={item.color} />
                    </View>
                    <Text className="flex-1 text-gray-800 text-base font-medium">
                      {item.label}
                    </Text>
                    <ChevronRight size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-200 mx-6 my-2" />

            {/* Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center px-6 py-4 mx-4 my-4 bg-red-50 rounded-xl border border-red-200 active:bg-red-100"
              activeOpacity={0.7}
            >
              <View className="w-11 h-11 rounded-xl bg-red-100 items-center justify-center mr-3">
                <LogOut size={20} color="#EF4444" />
              </View>
              <Text className="flex-1 text-red-600 text-base font-bold">
                Đăng xuất
              </Text>
              <ChevronRight size={18} color="#EF4444" />
            </TouchableOpacity>

            {/* Footer */}
            <View className="px-6 pb-8 pt-4">
              <View className="bg-gray-50 rounded-lg p-3 mb-2">
                <Text className="text-gray-600 text-xs text-center font-semibold">
                  GoPark - Đặt chỗ đỗ xe thông minh
                </Text>
              </View>
              <Text className="text-gray-400 text-xs text-center">
                Version 1.0.0 © 2025
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
