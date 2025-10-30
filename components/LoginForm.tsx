import { loginUser } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Car, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type UserRole = "user" | "owner";

interface LoginFormProps {
  onLoginSuccess: (role: UserRole, email: string) => void;
  onNavigateToRegister: () => void;
}

export default function LoginForm({
  onLoginSuccess,
  onNavigateToRegister,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email không được để trống";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Email không hợp lệ";

    if (!password) newErrors.password = "Mật khẩu không được để trống";
    else if (password.length < 8)
      newErrors.password = "Mật khẩu phải ≥ 8 ký tự";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginUser(email, password);

      const token = data?.token;
      const role = data?.data?.user?.role as UserRole;
      const userId = data?.data?.user?._id;

      if (!token || !role || !userId) {
        Alert.alert("Lỗi", "Không nhận được token hoặc role từ server");
        return;
      }

      if (role !== selectedRole) {
        Alert.alert(
          "Lỗi",
          `Vai trò không đúng. Bạn chọn: ${selectedRole}, nhưng server trả: ${role}`
        );
        return;
      }

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("role", role);
      await AsyncStorage.setItem("userId", userId);

      onLoginSuccess(role, email);
    } catch (err: any) {
      console.log("Login error:", err.message);
      Alert.alert("Lỗi", err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const roleButtons: { label: string; value: UserRole; icon: string }[] = [
    { label: "Người dùng", value: "user", icon: "👤" },
    { label: "Chủ bãi", value: "owner", icon: "🏢" },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header Section */}
      <View className="pt-12 pb-6 px-6 bg-gradient-to-b from-gray-50 to-white">
        <View className="items-center mb-2">
          <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-3 shadow-lg">
            <Car color="#FFFFFF" size={32} strokeWidth={2.5} />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">GoPark</Text>
          <Text className="text-sm text-gray-500">
            Quản lý bãi đỗ xe thông minh
          </Text>
        </View>
      </View>

      <View className="flex-1 px-6">
        {/* Role Selection */}
        <View className="mb-5">
          <Text className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Chọn vai trò
          </Text>
          <View className="flex-row gap-3">
            {roleButtons.map((role) => (
              <TouchableOpacity
                key={role.value}
                onPress={() => setSelectedRole(role.value)}
                className={`flex-1 py-3 rounded-xl items-center justify-center border-2 ${
                  selectedRole === role.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
                style={{
                  shadowColor: selectedRole === role.value ? "#2563EB" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: selectedRole === role.value ? 0.1 : 0.05,
                  shadowRadius: 8,
                  elevation: selectedRole === role.value ? 3 : 1,
                }}
              >
                <Text className="text-xl mb-1">{role.icon}</Text>
                <Text
                  className={`font-semibold text-xs ${
                    selectedRole === role.value
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Email
          </Text>
          <View
            className={`flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border-2 ${
              errors.email ? "border-red-400" : "border-transparent"
            }`}
          >
            <Mail color={errors.email ? "#F87171" : "#9CA3AF"} size={20} />
            <TextInput
              className="ml-3 flex-1 text-gray-900 text-base"
              placeholder="example@gopark.vn"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && (
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {errors.email}
            </Text>
          )}
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Mật khẩu
          </Text>
          <View
            className={`flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border-2 ${
              errors.password ? "border-red-400" : "border-transparent"
            }`}
          >
            <Lock color={errors.password ? "#F87171" : "#9CA3AF"} size={20} />
            <TextInput
              className="ml-3 flex-1 text-gray-900 text-base"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              secureTextEntry
            />
          </View>
          {errors.password && (
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {errors.password}
            </Text>
          )}
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`w-full h-14 rounded-2xl items-center justify-center mb-4 ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
          style={{
            shadowColor: "#2563EB",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: loading ? 0 : 0.3,
            shadowRadius: 8,
            elevation: loading ? 0 : 5,
          }}
        >
          <Text className="text-white font-bold text-base tracking-wide">
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center items-center mt-2">
          <Text className="text-gray-600 text-sm">Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text className="text-blue-600 font-semibold text-sm">
              Đăng ký ngay
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 items-center">
        <Text className="text-gray-400 text-xs">
          © 2024 GoPark. All rights reserved.
        </Text>
      </View>
    </View>
  );
}
