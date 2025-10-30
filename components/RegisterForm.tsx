import { Car, Lock, Mail, Phone, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registerUser } from "../lib/api";
import type { UserRole } from "./LoginForm";

interface RegisterFormProps {
  onRegisterSuccess: (role: UserRole, username: string) => void;
  onNavigateToLogin: () => void;
}

export function RegisterForm({
  onRegisterSuccess,
  onNavigateToLogin,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: any = {};

    if (!name) newErrors.name = "Họ tên không được để trống";
    else if (name.length < 2) newErrors.name = "Họ tên phải ≥ 2 ký tự";

    if (!phone) newErrors.phone = "Số điện thoại không được để trống";
    else if (!/^[0-9]{10,11}$/.test(phone))
      newErrors.phone = "Số điện thoại không hợp lệ";

    if (!email) newErrors.email = "Email không được để trống";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Email không hợp lệ";

    if (!password) newErrors.password = "Mật khẩu không được để trống";
    else if (password.length < 8)
      newErrors.password = "Mật khẩu phải ≥ 8 ký tự";

    if (!confirmPassword)
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const data = await registerUser(
        name,
        email,
        phone,
        password,
        confirmPassword
      );

      console.log("📨 Phản hồi từ server:", data);
      Alert.alert("🎉 Thành công", "Tài khoản của bạn đã được tạo!");

      setLoading(false);
      onRegisterSuccess("user", name);
    } catch (error: any) {
      setLoading(false);
      console.error("❌ Lỗi khi đăng ký:", error.message);
      Alert.alert("Lỗi", error.message || "Đăng ký thất bại");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header Section */}
      <View className="pt-12 pb-6 px-6 bg-gradient-to-b from-gray-50 to-white">
        <View className="items-center mb-2">
          <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-3 shadow-lg">
            <Car color="#FFFFFF" size={32} strokeWidth={2.5} />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Tạo tài khoản
          </Text>
          <Text className="text-sm text-gray-500">
            Tham gia cộng đồng GoPark
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Họ và tên
          </Text>
          <View
            className={`flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border-2 ${
              errors.name ? "border-red-400" : "border-transparent"
            }`}
          >
            <User color={errors.name ? "#F87171" : "#9CA3AF"} size={20} />
            <TextInput
              className="ml-3 flex-1 text-gray-900 text-base"
              placeholder="Nguyễn Văn A"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
            />
          </View>
          {errors.name && (
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {errors.name}
            </Text>
          )}
        </View>

        {/* Phone Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Số điện thoại
          </Text>
          <View
            className={`flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border-2 ${
              errors.phone ? "border-red-400" : "border-transparent"
            }`}
          >
            <Phone color={errors.phone ? "#F87171" : "#9CA3AF"} size={20} />
            <TextInput
              className="ml-3 flex-1 text-gray-900 text-base"
              placeholder="0912345678"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
            />
          </View>
          {errors.phone && (
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {errors.phone}
            </Text>
          )}
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
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
            />
          </View>
          {errors.email && (
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {errors.email}
            </Text>
          )}
        </View>

        {/* Password Input */}
        <View className="mb-4">
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
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
            />
          </View>
          {errors.password && (
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {errors.password}
            </Text>
          )}
        </View>

        {/* Confirm Password Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Xác nhận mật khẩu
          </Text>
          <View
            className={`flex-row items-center bg-gray-50 rounded-2xl px-4 h-14 border-2 ${
              errors.confirmPassword ? "border-red-400" : "border-transparent"
            }`}
          >
            <Lock
              color={errors.confirmPassword ? "#F87171" : "#9CA3AF"}
              size={20}
            />
            <TextInput
              className="ml-3 flex-1 text-gray-900 text-base"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined });
              }}
            />
          </View>
          {errors.confirmPassword && (
            <Text className="text-red-500 text-xs mt-2 ml-1">
              {errors.confirmPassword}
            </Text>
          )}
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
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
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base tracking-wide">
              Đăng ký
            </Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center items-center mb-8">
          <Text className="text-gray-600 text-sm">Đã có tài khoản? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text className="text-blue-600 font-semibold text-sm">
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
