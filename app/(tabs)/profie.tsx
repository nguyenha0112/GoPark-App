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
import { ArrowLeft, User, Mail, Phone, Calendar, Edit2, Save, X, Camera } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '@/lib/api';

interface UserProfile {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  profilePicture?: string;
}

export default function ProfilePage() {
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
    console.log('ProfilePage mounted');
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log('Loading profile...');
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      console.log('Token:', token ? 'exists' : 'null');
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
        router.replace('/(auth)/login');
        return;
      }

      console.log('Fetching from:', `${BASE_URL}/api/v1/users/me`);
      const response = await fetch(`${BASE_URL}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data loaded:', userData);
        setProfile(userData);
        setEditedName(userData.userName || '');
        setEditedPhone(userData.phoneNumber || '');
        setAvatarUri(userData.profilePicture || '');
      } else {
        throw new Error('Không thể tải thông tin cá nhân');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải thông tin';
      Alert.alert('Lỗi', errorMessage);
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
        // Kiểm tra xem camera có khả dụng không
        const cameraAvailable = await ImagePicker.getCameraPermissionsAsync();
        if (cameraAvailable.status !== 'granted') {
          Alert.alert('Lỗi', 'Không có quyền truy cập camera');
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: false,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: false,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        console.log('Image picked:', asset.uri);
        setAvatarUri(asset.uri);
        setAvatarFile(asset);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể chọn ảnh';
      
      // Nếu camera không hoạt động, đề xuất dùng thư viện
      if (useCamera && errorMessage.includes('activity')) {
        Alert.alert(
          'Camera không khả dụng',
          'Không thể mở camera. Bạn có muốn chọn ảnh từ thư viện không?',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Chọn từ thư viện', onPress: () => pickImage(false) },
          ]
        );
      } else {
        Alert.alert('Lỗi', errorMessage);
      }
    }
  };

  const showImagePickerOptions = () => {
    const options: any[] = [
      {
        text: 'Hủy',
        style: 'cancel',
      },
    ];

    // Chỉ hiện tùy chọn camera nếu không phải web
    if (Platform.OS !== 'web') {
      options.push({
        text: '📷 Chụp ảnh',
        onPress: () => pickImage(true),
      });
    }

    options.push({
      text: '🖼️ Thư viện ảnh',
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

      // Upload avatar nếu có ảnh mới
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
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="text-gray-600 mt-4">Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
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
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
        {/* Header Avatar */}
        <View className="bg-white items-center py-8 border-b border-gray-200">
          <TouchableOpacity 
            onPress={editing ? showImagePickerOptions : undefined}
            disabled={!editing}
            activeOpacity={editing ? 0.7 : 1}
            className={editing ? "items-center" : "items-center"}
          >
            <View className="relative">
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  className="w-24 h-24 rounded-full"
                  style={editing ? { borderWidth: 3, borderColor: '#22c55e' } : {}}
                  resizeMode="cover"
                />
              ) : (
                <View 
                  className="w-24 h-24 rounded-full bg-green-100 items-center justify-center"
                  style={editing ? { borderWidth: 3, borderColor: '#22c55e' } : {}}
                >
                  <User size={48} color="#22c55e" />
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
                  <Camera size={18} color="#FFF" />
                </View>
              )}
            </View>
            {editing && (
              <View className="bg-green-50 px-4 py-2 rounded-full mt-3">
                <Text className="text-green-700 text-sm font-semibold">
                  📷 Nhấn để thay đổi ảnh
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {!editing && <View className="h-3" />}
          <Text className="text-gray-900 text-2xl font-bold mt-2">{profile.userName}</Text>
          <View className="bg-green-100 px-3 py-1 rounded-full mt-2">
            <Text className="text-green-700 text-sm font-semibold">
              {profile.role === 'user' ? '👤 Người dùng' : profile.role === 'owner' ? '🏢 Chủ bãi' : '👑 Admin'}
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
                className="bg-gray-50 px-3 py-2 rounded-lg text-gray-900 border border-gray-200"
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
                className="bg-gray-50 px-3 py-2 rounded-lg text-gray-900 border border-gray-200"
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

      {/* Floating Edit/Save Button */}
      {!editing ? (
        <TouchableOpacity
          onPress={() => setEditing(true)}
          className="absolute bottom-6 right-6 bg-green-500 rounded-full p-4 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Edit2 size={24} color="#FFF" />
        </TouchableOpacity>
      ) : (
        <View className="absolute bottom-6 right-6 flex-row gap-3">
          <TouchableOpacity
            onPress={handleCancelEdit}
            className="bg-red-500 rounded-full p-4 shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            <X size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving || uploading}
            className={`rounded-full p-4 shadow-lg ${
              saving || uploading ? 'bg-gray-400' : 'bg-green-500'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            {(saving || uploading) ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Save size={24} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
