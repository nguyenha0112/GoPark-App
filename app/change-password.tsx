import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/lib/api';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/api/v1/users/updateMyPassword`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passwordCurrent: currentPassword,
          password: newPassword,
          passwordConfirm: confirmPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công', [
          { text: 'OK', onPress: () => router.back() },
        ]);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(result.message || 'Không thể đổi mật khẩu');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Đổi mật khẩu',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          {/* Info Box */}
          <View className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
            <Text className="text-blue-800 text-sm leading-6">
              ℹ️ Mật khẩu mới phải có ít nhất 6 ký tự. Để bảo mật tài khoản, hãy sử dụng mật khẩu
              mạnh với sự kết hợp chữ cái, số và ký tự đặc biệt.
            </Text>
          </View>

          {/* Form */}
          <View className="bg-white rounded-xl shadow-sm p-4">
            {/* Current Password */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Mật khẩu hiện tại *</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200">
                <Lock size={20} color="#6B7280" className="ml-3" style={{ marginLeft: 12 }} />
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Nhập mật khẩu hiện tại"
                  secureTextEntry={!showCurrent}
                  className="flex-1 px-3 py-3 text-gray-900"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrent(!showCurrent)}
                  className="pr-3"
                >
                  {showCurrent ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Mật khẩu mới *</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200">
                <Lock size={20} color="#6B7280" style={{ marginLeft: 12 }} />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nhập mật khẩu mới"
                  secureTextEntry={!showNew}
                  className="flex-1 px-3 py-3 text-gray-900"
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)} className="pr-3">
                  {showNew ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Xác nhận mật khẩu mới *</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200">
                <Lock size={20} color="#6B7280" style={{ marginLeft: 12 }} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Nhập lại mật khẩu mới"
                  secureTextEntry={!showConfirm}
                  className="flex-1 px-3 py-3 text-gray-900"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="pr-3">
                  {showConfirm ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleChangePassword}
              disabled={loading}
              className={`py-4 rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-500'}`}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-center text-base">
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Tips */}
          <View className="bg-white rounded-xl shadow-sm p-4 mt-4">
            <Text className="text-gray-900 font-bold mb-3">💡 Mẹo bảo mật</Text>
            <Text className="text-gray-600 text-sm leading-6 mb-2">
              • Sử dụng mật khẩu dài ít nhất 8 ký tự
            </Text>
            <Text className="text-gray-600 text-sm leading-6 mb-2">
              • Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
            </Text>
            <Text className="text-gray-600 text-sm leading-6 mb-2">
              • Không sử dụng thông tin cá nhân dễ đoán
            </Text>
            <Text className="text-gray-600 text-sm leading-6">
              • Thay đổi mật khẩu định kỳ và không dùng lại mật khẩu cũ
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
