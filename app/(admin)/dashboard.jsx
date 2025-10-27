import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/');
  };

  return (
    <View className="flex-1 p-5">
      <Text className="text-xl font-bold">Admin Dashboard</Text>
      {/* Quản lý toàn hệ thống */}
      <TouchableOpacity onPress={handleLogout}>
        <Text className="bg-red-500 text-white p-3 rounded text-center mt-5">
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </View>
  );
}