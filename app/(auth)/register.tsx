import { useRouter } from "expo-router";
import { View } from "react-native";
import RegisterForm, { User } from "../../components/RegisterForm";

export default function Register() {
  const router = useRouter();

  // Xử lý khi user đăng ký thành công
  const handleRegister = (user: User) => {
    console.log("Người dùng vừa đăng ký:", user);
    // Sau khi đăng ký xong, quay lại màn hình login
    router.back();
  };

  return (
    <View className="flex-1">
      <RegisterForm onRegister={handleRegister} onBack={() => router.back()} />
    </View>
  );
}
