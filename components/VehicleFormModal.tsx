import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { X, Upload, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/lib/api';

interface Vehicle {
  _id: string;
  licensePlate: string;
  capacity: number;
  imageVehicle?: string;
}

interface VehicleFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicle?: Vehicle | null;
  vehiclesCount: number;
}

export default function VehicleFormModal({
  visible,
  onClose,
  onSuccess,
  vehicle,
  vehiclesCount,
}: VehicleFormModalProps) {
  const [licensePlate, setLicensePlate] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [imageUri, setImageUri] = useState<string>('');
  const [imageFile, setImageFile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setLicensePlate(vehicle.licensePlate);
      setCapacity(vehicle.capacity);
      setImageUri(vehicle.imageVehicle || '');
    } else {
      resetForm();
    }
  }, [vehicle, visible]);

  const resetForm = () => {
    setLicensePlate('');
    setCapacity(4);
    setImageUri('');
    setImageFile(null);
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Cần quyền truy cập',
        'Ứng dụng cần quyền truy cập camera và thư viện ảnh để chọn ảnh xe.'
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
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageFile(asset);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return '';

    try {
      setUploading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      const formData = new FormData();
      const fileName = imageFile.uri.split('/').pop();
      const fileType = imageFile.mimeType || 'image/jpeg';

      // Append file theo định dạng backend expect
      formData.append('file', {
        uri: imageFile.uri,
        type: fileType,
        name: fileName,
      } as any);
      
      // Append type parameter
      formData.append('type', 'vehicle');
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
      console.error('Error uploading image:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên. Ảnh sẽ không được lưu.');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!licensePlate.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập biển số xe');
      return;
    }

    if (!capacity || capacity < 1) {
      Alert.alert('Lỗi', 'Vui lòng nhập sức chứa hợp lệ');
      return;
    }

    // Giới hạn tối đa 3 xe
    if (!vehicle && vehiclesCount >= 3) {
      Alert.alert('Giới hạn', 'Bạn chỉ được đăng ký tối đa 3 phương tiện');
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');

      // Upload ảnh nếu có ảnh mới được chọn
      let imageUrl = vehicle?.imageVehicle || '';
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const vehicleData = {
        licensePlate: licensePlate.trim().toUpperCase(),
        capacity: capacity,
        imageVehicle: imageUrl,
      };

      const url = vehicle
        ? `${BASE_URL}/api/v1/vehicles/${vehicle._id}`
        : `${BASE_URL}/api/v1/vehicles`;

      const response = await fetch(url, {
        method: vehicle ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (response.ok) {
        Alert.alert(
          'Thành công',
          vehicle ? 'Cập nhật xe thành công' : 'Thêm xe thành công'
        );
        resetForm();
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        if (error.field === 'licensePlate') {
          throw new Error('Biển số này đã được đăng ký');
        }
        throw new Error(error.error || 'Không thể lưu thông tin xe');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi');
    } finally {
      setSaving(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert('Chọn ảnh xe', 'Bạn muốn chọn ảnh từ đâu?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Chụp ảnh',
        onPress: () => pickImage(true),
      },
      {
        text: 'Thư viện ảnh',
        onPress: () => pickImage(false),
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: '90%' }}>
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">
              {vehicle ? 'Sửa thông tin xe' : 'Thêm xe mới'}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {/* Image Upload */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Ảnh xe</Text>
              {imageUri ? (
                <View className="relative">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setImageUri('');
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
                  >
                    <X size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={showImagePickerOptions}
                    className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2"
                  >
                    <Camera size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={showImagePickerOptions}
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-48 items-center justify-center"
                >
                  <Upload size={40} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-2">Chọn ảnh xe</Text>
                  <Text className="text-gray-400 text-xs mt-1">Chụp ảnh hoặc chọn từ thư viện</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* License Plate */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Biển số xe *</Text>
              <TextInput
                value={licensePlate}
                onChangeText={setLicensePlate}
                placeholder="VD: 30A-12345 hoặc 43A-12345"
                className="bg-gray-50 px-4 py-3 rounded-lg text-gray-900 border border-gray-200"
                autoCapitalize="characters"
              />
            </View>

            {/* Capacity */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Sức chứa (số chỗ) *</Text>
              <View className="flex-row gap-2 mb-2">
                {[2, 4, 5, 7].map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setCapacity(num)}
                    className={`flex-1 py-3 rounded-lg border-2 ${
                      capacity === num
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        capacity === num ? 'text-green-700' : 'text-gray-600'
                      }`}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                value={capacity.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text);
                  if (!isNaN(num) && num > 0) setCapacity(num);
                }}
                placeholder="Hoặc nhập số khác"
                keyboardType="number-pad"
                className="bg-gray-50 px-4 py-3 rounded-lg text-gray-900 border border-gray-200"
              />
            </View>

            {/* Info Box */}
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <Text className="text-blue-800 text-sm">
                ℹ️ Bạn có thể đăng ký tối đa 3 phương tiện
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-100 py-4 rounded-lg"
              >
                <Text className="text-gray-700 font-semibold text-center">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving || uploading}
                className={`flex-1 py-4 rounded-lg ${
                  saving || uploading ? 'bg-gray-400' : 'bg-green-500'
                }`}
              >
                {saving || uploading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text className="text-white font-semibold text-center">
                    {vehicle ? 'Cập nhật' : 'Thêm xe'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
