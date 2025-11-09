import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Calendar, Camera, Edit3, Save, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '@/lib/api';

interface UserProfile {
  _id: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  createdAt?: string;
  profilePicture?: string;
}

export default function InformationPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [avatarUri, setAvatarUri] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
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
        setAvatarUri(userData.profilePicture || '');
      } else {
        throw new Error('Không thể tải thông tin cá nhân');
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      Alert.alert('Lỗi', error instanceof Error ? error.message : 'Không thể tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Cần quyền truy cập',
        'Ứng dụng cần quyền truy cập camera và thư viện ảnh để thay đổi ảnh đại diện.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async (useCamera: boolean = false) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      let result;
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setAvatarUri(asset.uri);
        setAvatarFile(asset);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const showImagePickerOptions = () => {
    const options: any[] = [
      { text: 'Hủy', style: 'cancel' },
    ];

    if (Platform.OS !== 'web') {
      options.push({
        text: '📷 Chụp ảnh',
        onPress: () => pickImage(true),
      });
    }

    options.push({
      text: '🖼️ Chọn từ thư viện',
      onPress: () => pickImage(false),
    });

    Alert.alert('Chọn ảnh đại diện', 'Bạn muốn chọn ảnh từ đâu?', options);
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return '';

    try {
      setUploading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      const formData = new FormData();
      const fileName = avatarFile.uri.split('/').pop();
      const fileType = avatarFile.mimeType || 'image/jpeg';

      formData.append('file', {
        uri: avatarFile.uri,
        type: fileType,
        name: fileName,
      } as any);
      
      formData.append('type', 'avatar');
      if (userId) {
        formData.append('userId', userId);
      }

      const response = await fetch(`${BASE_URL}/api/v1/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.url || '';
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên. Ảnh sẽ không được lưu.');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editedName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
        return;
      }

      let profilePictureUrl = profile?.profilePicture || '';
      if (avatarFile) {
        profilePictureUrl = await uploadAvatar();
      }

      const response = await fetch(`${BASE_URL}/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: editedName.trim(),
          phoneNumber: editedPhone.trim(),
          profilePicture: profilePictureUrl,
        }),
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Cập nhật thông tin thành công');
        setEditing(false);
        setAvatarFile(null);
        loadProfile();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể cập nhật';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setAvatarFile(null);
    if (profile) {
      setEditedName(profile.userName || '');
      setEditedPhone(profile.phoneNumber || '');
      setAvatarUri(profile.profilePicture || '');
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
      <View className="flex-1 bg-gray-50">
        <Stack.Screen options={{ 
          headerShown: true,
          title: 'Thông tin cá nhân',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-gray-600 mt-4">Đang tải thông tin...</Text>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-gray-50">
        <Stack.Screen options={{ 
          headerShown: true,
          title: 'Thông tin cá nhân',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }} />
        <View className="flex-1 items-center justify-center px-6">
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
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Thông tin cá nhân',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            !editing ? (
              <TouchableOpacity onPress={() => setEditing(true)} className="ml-4 p-2">
                <Edit3 size={20} color="#22c55e" />
              </TouchableOpacity>
            ) : (
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={handleCancelEdit} className="p-2">
                  <X size={20} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} className="p-2" disabled={saving || uploading}>
                  <Save size={20} color={saving || uploading ? "#9CA3AF" : "#22c55e"} />
                </TouchableOpacity>
              </View>
            )
          ),
        }}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Avatar Section */}
        <View className="bg-white items-center py-8 border-b border-gray-100">
          <TouchableOpacity 
            onPress={editing ? showImagePickerOptions : undefined}
            disabled={!editing}
            activeOpacity={editing ? 0.7 : 1}
            className="relative"
          >
            <View className="relative">
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  className="w-28 h-28 rounded-full"
                  style={editing ? { borderWidth: 4, borderColor: '#22c55e' } : {}}
                  resizeMode="cover"
                />
              ) : (
                <View 
                  className="w-28 h-28 rounded-full bg-green-50 items-center justify-center"
                  style={editing ? { borderWidth: 4, borderColor: '#22c55e' } : {}}
                >
                  <User size={56} color="#22c55e" />
                </View>
              )}
              {editing && (
                <View 
                  className="absolute bottom-0 right-0 bg-green-500 rounded-full p-3"
                  style={{ 
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 2 }, 
                    shadowOpacity: 0.3, 
                    shadowRadius: 4,
                    elevation: 6 
                  }}
                >
                  <Camera size={20} color="#FFF" />
                </View>
              )}
            </View>
            {editing && (
              <View className="bg-green-50 px-4 py-2 rounded-full mt-4">
                <Text className="text-green-700 text-sm font-semibold text-center">
                  📷 Nhấn để thay đổi ảnh
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {!editing && (
            <>
              <Text className="text-gray-900 text-2xl font-bold mt-4">{profile.userName}</Text>
              <View className="bg-green-50 px-4 py-1.5 rounded-full mt-2">
                <Text className="text-green-700 text-sm font-semibold">
                  {profile.role === 'user' ? '👤 Người dùng' : profile.role === 'owner' ? '🏢 Chủ bãi' : '👑 Admin'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Profile Information */}
        <View className="px-4 py-4">
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <View className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <Text className="text-base font-bold text-gray-900">
                Thông tin cá nhân
              </Text>
            </View>

            {/* Name */}
            <View className="px-4 py-4 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center mr-3">
                  <User size={16} color="#3B82F6" />
                </View>
                <Text className="text-gray-600 text-sm font-medium">Họ và tên</Text>
              </View>
              {editing ? (
                <TextInput
                  value={editedName}
                  onChangeText={setEditedName}
                  className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900 border border-gray-200 ml-11"
                  placeholder="Nhập họ tên"
                  placeholderTextColor="#9CA3AF"
                />
              ) : (
                <Text className="text-gray-900 font-semibold text-base ml-11">{profile.userName}</Text>
              )}
            </View>

            {/* Email */}
            <View className="px-4 py-4 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-lg bg-purple-50 items-center justify-center mr-3">
                  <Mail size={16} color="#A855F7" />
                </View>
                <Text className="text-gray-600 text-sm font-medium">Email</Text>
              </View>
              <Text className="text-gray-900 font-semibold text-base ml-11">{profile.email}</Text>
              <Text className="text-xs text-gray-500 mt-1 ml-11">📧 Email không thể thay đổi</Text>
            </View>

            {/* Phone */}
            <View className="px-4 py-4 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-lg bg-green-50 items-center justify-center mr-3">
                  <Phone size={16} color="#22C55E" />
                </View>
                <Text className="text-gray-600 text-sm font-medium">Số điện thoại</Text>
              </View>
              {editing ? (
                <TextInput
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900 border border-gray-200 ml-11"
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              ) : (
                <Text className="text-gray-900 font-semibold text-base ml-11">
                  {profile.phoneNumber || 'Chưa cập nhật'}
                </Text>
              )}
            </View>

            {/* Join Date */}
            <View className="px-4 py-4">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-lg bg-orange-50 items-center justify-center mr-3">
                  <Calendar size={16} color="#F97316" />
                </View>
                <Text className="text-gray-600 text-sm font-medium">Ngày tham gia</Text>
              </View>
              <Text className="text-gray-900 font-semibold text-base ml-11">
                {profile.createdAt ? formatDate(profile.createdAt) : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="bg-white rounded-2xl shadow-sm mt-4 overflow-hidden">
            <TouchableOpacity
              onPress={() => router.push('/change-password')}
              className="px-4 py-4 border-b border-gray-100 flex-row items-center justify-between active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-yellow-50 items-center justify-center mr-3">
                  <Text className="text-base">🔐</Text>
                </View>
                <Text className="text-gray-900 font-medium">Đổi mật khẩu</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/vehicles')}
              className="px-4 py-4 flex-row items-center justify-between active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-red-50 items-center justify-center mr-3">
                  <Text className="text-base">🚗</Text>
                </View>
                <Text className="text-gray-900 font-medium">Quản lý phương tiện</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Loading overlay when uploading */}
      {(saving || uploading) && (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <ActivityIndicator size="large" color="#22c55e" />
            <Text className="text-gray-900 font-semibold mt-4">
              {uploading ? 'Đang tải ảnh lên...' : 'Đang lưu...'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
