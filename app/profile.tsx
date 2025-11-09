import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/lib/api';

interface UserProfile {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
        router.replace('/(auth)/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setProfile(userData);
        setEditedName(userData.userName || '');
        setEditedPhone(userData.phoneNumber || '');
      } else {
        throw new Error('Không thể tải thông tin cá nhân');
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: editedName,
          phoneNumber: editedPhone,
        }),
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Cập nhật thông tin thành công');
        setEditing(false);
        loadProfile();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể cập nhật thông tin');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 bg-gray-50 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-gray-600 mt-4">Đang tải thông tin...</Text>
        </View>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 bg-gray-50 items-center justify-center px-6">
          <Text className="text-red-600 text-lg font-semibold mb-4">
            Không thể tải thông tin
          </Text>
          <TouchableOpacity
            onPress={loadProfile}
            className="bg-green-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Hồ sơ của tôi',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            !editing ? (
              <TouchableOpacity onPress={() => setEditing(true)} className="ml-4 p-2">
                <Edit2 size={20} color="#22c55e" />
              </TouchableOpacity>
            ) : (
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => setEditing(false)} className="p-2">
                  <X size={20} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} className="p-2" disabled={saving}>
                  <Save size={20} color="#22c55e" />
                </TouchableOpacity>
              </View>
            )
          ),
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        {/* Header Avatar */}
        <View className="bg-white items-center py-8 border-b border-gray-200">
          <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-4">
            <User size={48} color="#22c55e" />
          </View>
          <Text className="text-gray-900 text-2xl font-bold">{profile.userName}</Text>
          <View className="bg-green-100 px-3 py-1 rounded-full mt-2">
            <Text className="text-green-700 text-sm font-semibold">
              {profile.role === 'user' ? 'Người dùng' : profile.role === 'owner' ? 'Chủ bãi' : 'Admin'}
            </Text>
          </View>
        </View>

        {/* Profile Info */}
        <View className="bg-white m-4 rounded-xl shadow-sm">
          <Text className="text-lg font-bold text-gray-900 px-4 pt-4 pb-2">
            Thông tin cá nhân
          </Text>

          {/* Name */}
          <View className="px-4 py-3 border-b border-gray-100">
            <View className="flex-row items-center mb-2">
              <User size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">Họ và tên</Text>
            </View>
            {editing ? (
              <TextInput
                value={editedName}
                onChangeText={setEditedName}
                className="bg-gray-50 px-3 py-2 rounded-lg text-gray-900"
                placeholder="Nhập họ tên"
              />
            ) : (
              <Text className="text-gray-900 font-medium">{profile.userName}</Text>
            )}
          </View>

          {/* Email */}
          <View className="px-4 py-3 border-b border-gray-100">
            <View className="flex-row items-center mb-2">
              <Mail size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">Email</Text>
            </View>
            <Text className="text-gray-900 font-medium">{profile.email}</Text>
            <Text className="text-xs text-gray-500 mt-1">Email không thể thay đổi</Text>
          </View>

          {/* Phone */}
          <View className="px-4 py-3 border-b border-gray-100">
            <View className="flex-row items-center mb-2">
              <Phone size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">Số điện thoại</Text>
            </View>
            {editing ? (
              <TextInput
                value={editedPhone}
                onChangeText={setEditedPhone}
                className="bg-gray-50 px-3 py-2 rounded-lg text-gray-900"
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
            ) : (
              <Text className="text-gray-900 font-medium">
                {profile.phoneNumber || 'Chưa cập nhật'}
              </Text>
            )}
          </View>

          {/* Join Date */}
          <View className="px-4 py-3">
            <View className="flex-row items-center mb-2">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">Ngày tham gia</Text>
            </View>
            <Text className="text-gray-900 font-medium">{formatDate(profile.createdAt)}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="bg-white mx-4 mb-4 rounded-xl shadow-sm">
          <TouchableOpacity
            onPress={() => router.push('/change-password')}
            className="px-4 py-4 border-b border-gray-100"
          >
            <Text className="text-gray-900 font-medium">Đổi mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/vehicles')}
            className="px-4 py-4"
          >
            <Text className="text-gray-900 font-medium">Quản lý phương tiện</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
