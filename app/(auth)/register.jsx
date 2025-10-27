import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Register() {
  const router = useRouter();
  
  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-bold mb-5">Đăng ký</Text>
      {/* Thêm form đăng ký ở đây */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-blue-500">Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}