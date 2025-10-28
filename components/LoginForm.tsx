import { loginUser } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

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

  const roleButtons: { label: string; value: UserRole }[] = [
    { label: "Người dùng", value: "user" },
    { label: "Chủ bãi", value: "owner" },
  ];

  return (
    <View className="flex-1 justify-start pt-20 p-4 bg-gray-50">
      <View className="mb-6 items-center">
        <Text className="text-2xl font-bold text-black mb-1">Đăng nhập</Text>
      </View>

      <View className="flex-row justify-between mb-4">
        {roleButtons.map((role) => (
          <TouchableOpacity
            key={role.value}
            onPress={() => setSelectedRole(role.value)}
            className={`flex-1 py-3 mx-1 rounded-xl border-2 items-center justify-center ${
              selectedRole === role.value
                ? "border-black bg-gray-200"
                : "border-gray-300 bg-white"
            }`}
          >
            <Text
              className={`font-medium ${
                selectedRole === role.value ? "text-black" : "text-gray-600"
              }`}
            >
              {role.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mb-3">
        <Text className="text-sm font-medium mb-1 text-black">Email</Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-12">
          <Mail color="#9CA3AF" size={18} />
          <TextInput
            className="ml-2 flex-1 text-black"
            placeholder="example@gopark.vn"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && (
          <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
        )}
      </View>

      <View className="mb-3">
        <Text className="text-sm font-medium mb-1 text-black">Mật khẩu</Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-12">
          <Lock color="#9CA3AF" size={18} />
          <TextInput
            className="ml-2 flex-1 text-black"
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {errors.password && (
          <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className={`w-full h-12 rounded-xl items-center justify-center mb-3 mt-2 ${
          loading ? "bg-gray-400" : "bg-black"
        }`}
      >
        <Text className="text-white font-medium text-base">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-3">
        <Text className="text-gray-600 mr-1">Chưa có tài khoản?</Text>
        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text className="text-black font-semibold">Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
