import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View className="flex-1 p-5">
      <Text className="text-xl font-bold mb-5">Hồ sơ</Text>
      {/* Thông tin user */}
      <TouchableOpacity onPress={handleLogout}>
        <Text className="bg-red-500 text-white p-3 rounded text-center mt-5">
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </View>
  );
}