import { loginUser } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Car, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("role", role);
      await AsyncStorage.setItem("userId", userId);

      onLoginSuccess(role, email);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
        className="bg-white"
      >
        {/* Header */}
        <View className="items-center mb-10 mt-8">
          <View className="w-20 h-20 bg-blue-100 rounded-3xl items-center justify-center mb-3 shadow-sm">
            <Car color="#2563EB" size={36} strokeWidth={2.2} />
          </View>
          <Text className="text-3xl font-extrabold text-blue-600 mb-1">
            GoPark
          </Text>
          <Text className="text-gray-500 text-sm">
            Quản lý bãi đỗ xe thông minh
          </Text>
        </View>

        {/* Form */}
        <View className="bg-white mx-6 rounded-3xl p-6 shadow-md border border-gray-100">
          {/* Email */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
            >
              <Mail color={errors.email ? "#EF4444" : "#9CA3AF"} size={20} />
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

          {/* Password */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border ${
                errors.password ? "border-red-400" : "border-gray-200"
              }`}
            >
              <Lock color={errors.password ? "#EF4444" : "#9CA3AF"} size={20} />
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
            activeOpacity={0.85}
            className={`w-full h-14 rounded-2xl items-center justify-center mb-4 ${
              loading ? "bg-gray-400" : "bg-blue-600"
            }`}
            style={{
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: loading ? 0 : 0.25,
              shadowRadius: 8,
              elevation: loading ? 0 : 4,
            }}
          >
            <Text className="text-white font-bold text-base tracking-wide">
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Text>
          </TouchableOpacity>

          {/* Register link */}
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
        <View className="mt-10 mb-8 items-center">
          <Text className="text-gray-400 text-xs">
            © 2024 GoPark. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
