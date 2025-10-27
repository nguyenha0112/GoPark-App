import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  
  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className="text-2xl font-bold mb-5">Hệ thống Quản lý Bãi đỗ</Text>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text className="bg-blue-500 text-white px-6 py-3 rounded">Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}