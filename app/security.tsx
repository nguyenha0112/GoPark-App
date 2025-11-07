import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Fingerprint, Lock, Smartphone, Shield, Eye, History, LogOut, Key } from 'lucide-react-native';

export default function SecurityPage() {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [requirePasswordOnOpen, setRequirePasswordOnOpen] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);

  const handleBiometricToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Kích hoạt sinh trắc học',
        'Bạn có muốn sử dụng vân tay/Face ID để đăng nhập không?',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Kích hoạt',
            onPress: () => {
              setBiometricEnabled(true);
              Alert.alert('Thành công', 'Đã kích hoạt đăng nhập sinh trắc học');
            },
          },
        ]
      );
    } else {
      setBiometricEnabled(false);
    }
  };

  const handle2FAToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Xác thực 2 lớp',
        'Bạn sẽ cần nhập mã OTP từ SMS hoặc ứng dụng xác thực khi đăng nhập.',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Thiết lập',
            onPress: () => {
              setTwoFactorEnabled(true);
              Alert.alert('Thành công', 'Đã bật xác thực 2 lớp');
            },
          },
        ]
      );
    } else {
      setTwoFactorEnabled(false);
    }
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const handleViewLoginHistory = () => {
    Alert.alert(
      'Lịch sử đăng nhập',
      'Thiết bị: iPhone 14 Pro\nĐịa điểm: TP.HCM\nThời gian: 20/12/2024 14:30\n\nThiết bị: iPad Air\nĐịa điểm: TP.HCM\nThời gian: 18/12/2024 09:15'
    );
  };

  const handleLogoutAllDevices = () => {
    Alert.alert(
      'Đăng xuất tất cả thiết bị',
      'Bạn sẽ cần đăng nhập lại trên tất cả các thiết bị. Tiếp tục?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Thành công', 'Đã đăng xuất khỏi tất cả thiết bị');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Bảo mật & Quyền riêng tư',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Security Level Indicator */}
          <View 
            className="bg-white rounded-2xl p-6 mb-4"
            style={{ 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.1, 
              shadowRadius: 4,
              elevation: 3 
            }}
          >
            <View className="items-center mb-4">
              <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center mb-3">
                <Shield size={40} color="#22C55E" />
              </View>
              <Text className="text-gray-900 text-lg font-bold mb-1">Mức độ bảo mật</Text>
              <View className="bg-green-50 px-4 py-1.5 rounded-full">
                <Text className="text-green-700 font-semibold">
                  {biometricEnabled && twoFactorEnabled ? '🟢 Cao' : 
                   biometricEnabled || twoFactorEnabled ? '🟡 Trung bình' : 
                   '🔴 Thấp'}
                </Text>
              </View>
            </View>
            <View className="bg-gray-50 rounded-xl p-3">
              <Text className="text-gray-600 text-sm text-center">
                Bật sinh trắc học và xác thực 2 lớp để nâng cao bảo mật tài khoản
              </Text>
            </View>
          </View>

          {/* Login & Authentication */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold text-base mb-3">
              🔐 Đăng nhập & Xác thực
            </Text>

            <View 
              className="bg-white rounded-2xl overflow-hidden"
              style={{ 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 1 }, 
                shadowOpacity: 0.05, 
                shadowRadius: 3,
                elevation: 2 
              }}
            >
              {/* Biometric Login */}
              <View className="px-4 py-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center mr-3">
                      <Fingerprint size={20} color="#A855F7" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base mb-1">
                        Đăng nhập sinh trắc học
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        Sử dụng vân tay hoặc Face ID
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={biometricEnabled}
                    onValueChange={handleBiometricToggle}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor={biometricEnabled ? '#22C55E' : '#F3F4F6'}
                  />
                </View>
              </View>

              {/* Require Password */}
              <View className="px-4 py-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mr-3">
                      <Lock size={20} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base mb-1">
                        Yêu cầu mật khẩu
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        Khi mở ứng dụng
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={requirePasswordOnOpen}
                    onValueChange={setRequirePasswordOnOpen}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor={requirePasswordOnOpen ? '#22C55E' : '#F3F4F6'}
                  />
                </View>
              </View>

              {/* Two-Factor Authentication */}
              <View className="px-4 py-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-xl bg-green-50 items-center justify-center mr-3">
                      <Smartphone size={20} color="#22C55E" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base mb-1">
                        Xác thực 2 lớp (2FA)
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        Thêm lớp bảo vệ bằng mã OTP
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={twoFactorEnabled}
                    onValueChange={handle2FAToggle}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor={twoFactorEnabled ? '#22C55E' : '#F3F4F6'}
                  />
                </View>
              </View>

              {/* Session Timeout */}
              <View className="px-4 py-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3">
                      <Eye size={20} color="#F97316" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base mb-1">
                        Tự động đăng xuất
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        Sau 15 phút không hoạt động
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={sessionTimeout}
                    onValueChange={setSessionTimeout}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor={sessionTimeout ? '#22C55E' : '#F3F4F6'}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Password & Account Management */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold text-base mb-3">
              🔑 Quản lý tài khoản
            </Text>

            <View 
              className="bg-white rounded-2xl overflow-hidden"
              style={{ 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 1 }, 
                shadowOpacity: 0.05, 
                shadowRadius: 3,
                elevation: 2 
              }}
            >
              <TouchableOpacity
                onPress={handleChangePassword}
                className="px-4 py-4 border-b border-gray-100 flex-row items-center justify-between active:bg-gray-50"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-xl bg-yellow-50 items-center justify-center mr-3">
                    <Key size={20} color="#F59E0B" />
                  </View>
                  <Text className="text-gray-900 font-semibold text-base">Đổi mật khẩu</Text>
                </View>
                <Text className="text-gray-400 text-lg">›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleViewLoginHistory}
                className="px-4 py-4 border-b border-gray-100 flex-row items-center justify-between active:bg-gray-50"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center mr-3">
                    <History size={20} color="#6366F1" />
                  </View>
                  <Text className="text-gray-900 font-semibold text-base">Lịch sử đăng nhập</Text>
                </View>
                <Text className="text-gray-400 text-lg">›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogoutAllDevices}
                className="px-4 py-4 flex-row items-center justify-between active:bg-gray-50"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-xl bg-red-50 items-center justify-center mr-3">
                    <LogOut size={20} color="#EF4444" />
                  </View>
                  <Text className="text-gray-900 font-semibold text-base">
                    Đăng xuất tất cả thiết bị
                  </Text>
                </View>
                <Text className="text-gray-400 text-lg">›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Security Tips */}
          <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <Text className="text-blue-900 font-semibold mb-2">💡 Mẹo bảo mật</Text>
            <Text className="text-blue-700 text-sm mb-2">
              • Sử dụng mật khẩu mạnh với ít nhất 8 ký tự
            </Text>
            <Text className="text-blue-700 text-sm mb-2">
              • Bật xác thực 2 lớp để bảo vệ tài khoản
            </Text>
            <Text className="text-blue-700 text-sm mb-2">
              • Không chia sẻ mật khẩu với người khác
            </Text>
            <Text className="text-blue-700 text-sm">
              • Cập nhật ứng dụng thường xuyên
            </Text>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

