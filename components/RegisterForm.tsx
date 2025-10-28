import { Lock, Mail, Phone, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("⚠️ Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("⚠️ Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

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

      // ✅ Reset loading và gọi callback để điều hướng
      setLoading(false);
      onRegisterSuccess("user", name);
    } catch (error: any) {
      setLoading(false);
      console.error("❌ Lỗi khi đăng ký:", error.message);
      Alert.alert("Đăng ký thất bại", error.message || "Vui lòng thử lại sau");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <View className="w-full max-w-sm">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-6">
          Đăng ký tài khoản
        </Text>

        {/* Ô nhập họ tên */}
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mb-3 bg-gray-50">
          <User color="#666" size={20} />
          <TextInput
            placeholder="Họ và tên"
            value={name}
            onChangeText={setName}
            className="flex-1 ml-2 text-gray-800"
            placeholderTextColor="#999"
          />
        </View>

        {/* Ô nhập số điện thoại */}
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mb-3 bg-gray-50">
          <Phone color="#666" size={20} />
          <TextInput
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            className="flex-1 ml-2 text-gray-800"
            placeholderTextColor="#999"
          />
        </View>

        {/* Ô nhập email */}
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mb-3 bg-gray-50">
          <Mail color="#666" size={20} />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="flex-1 ml-2 text-gray-800"
            placeholderTextColor="#999"
          />
        </View>

        {/* Ô nhập mật khẩu */}
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mb-3 bg-gray-50">
          <Lock color="#666" size={20} />
          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="flex-1 ml-2 text-gray-800"
            placeholderTextColor="#999"
          />
        </View>

        {/* Ô nhập xác nhận mật khẩu */}
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mb-5 bg-gray-50">
          <Lock color="#666" size={20} />
          <TextInput
            placeholder="Xác nhận mật khẩu"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="flex-1 ml-2 text-gray-800"
            placeholderTextColor="#999"
          />
        </View>

        {/* Nút đăng ký */}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded-xl ${
            loading ? "bg-gray-700" : "bg-black"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white font-semibold text-lg">
              Đăng ký
            </Text>
          )}
        </TouchableOpacity>

        {/* Nút quay lại đăng nhập */}
        <View className="flex-row justify-center mt-3">
          <Text className="text-gray-600 mr-1">Đã có tài khoản?</Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text className="text-black font-semibold">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
