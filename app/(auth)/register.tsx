import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import type { UserRole } from "../../components/LoginForm";
import { RegisterForm } from "../../components/RegisterForm";

export default function Register() {
  const router = useRouter();

  // ✅ Khi user đăng ký thành công
  const handleRegisterSuccess = (role: UserRole, username: string) => {
    console.log("🎉 Người dùng vừa đăng ký:", { role, username });

    // ⏳ Đợi 1 chút rồi điều hướng sang trang đăng nhập
    setTimeout(() => {
      router.replace("/login"); // ✅ điều hướng gọn gàng
    }, 800);
  };

  return (
    <View className="flex-1 bg-white">
      <RegisterForm
        onRegisterSuccess={handleRegisterSuccess}
        onNavigateToLogin={() => router.replace("/login")}
      />
    </View>
  );
}
