import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    let role = null;

    if (username === "user" && password === "user") role = "user";
    else if (username === "owner" && password === "owner") role = "owner";
    else if (username === "admin" && password === "admin") role = "admin";
    else {
      Alert.alert("Lỗi", "Sai tài khoản hoặc mật khẩu");
      return;
    }

    await AsyncStorage.setItem("userRole", role);
    await AsyncStorage.setItem("username", username);

    // Định tuyến theo role - sửa lại cách routing
    try {
      if (role === "user") {
        router.replace({ pathname: "/(tabs)/home" } as any);
      } else if (role === "owner") {
        router.replace({ pathname: "/(owner)/dashboard" } as any);
      } else if (role === "admin") {
        router.replace({ pathname: "/(admin)/dashboard" } as any);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Lỗi", "Không thể chuyển trang");
    }
  };

  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-bold mb-5">Đăng nhập</Text>
      <TextInput
        className="border p-3 mb-3 rounded"
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="border p-3 mb-3 rounded"
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin}>
        <Text className="bg-blue-500 text-white p-3 rounded text-center">
          Đăng nhập
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/(auth)/register" } as any)}
      >
        <Text className="text-blue-500 text-center mt-3">Đăng ký</Text>
      </TouchableOpacity>

      <View className="mt-5 p-3 bg-gray-100 rounded">
        <Text>Test accounts: user/user, owner/owner, admin/admin</Text>
      </View>
    </View>
  );
}
