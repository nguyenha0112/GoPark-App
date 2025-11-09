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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Upload, Camera, Check, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View 
            className="bg-white rounded-t-3xl"
            style={{ maxHeight: '90%' }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">
                {vehicle ? 'Sửa thông tin xe' : 'Thêm xe mới'}
              </Text>
              <TouchableOpacity 
                onPress={onClose} 
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                padding: 20,
                paddingBottom: 32,
              }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Image Upload Section */}
              <View className="mb-5">
                <Text className="text-gray-700 font-semibold text-base mb-3">Ảnh xe</Text>
                {imageUri ? (
                  <View className="relative rounded-2xl overflow-hidden">
                    <Image
                      source={{ uri: imageUri }}
                      className="w-full h-56"
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-3 right-3 flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => {
                          setImageUri('');
                          setImageFile(null);
                        }}
                        className="bg-red-500 rounded-full p-2.5"
                      >
                        <X size={18} color="#FFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={showImagePickerOptions}
                        className="bg-green-500 rounded-full p-2.5"
                      >
                        <Camera size={18} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={showImagePickerOptions}
                    className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl h-56 items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <View className="bg-green-100 p-4 rounded-full mb-3">
                      <Upload size={32} color="#10B981" />
                    </View>
                    <Text className="text-gray-700 font-semibold text-base">Chọn ảnh xe</Text>
                    <Text className="text-gray-500 text-sm mt-1">Chụp ảnh hoặc chọn từ thư viện</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* License Plate Input */}
              <View className="mb-5">
                <Text className="text-gray-700 font-semibold text-base mb-2">
                  Biển số xe <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                  placeholder="VD: 30A-12345 hoặc 43A-12345"
                  placeholderTextColor="#9CA3AF"
                  className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
                  autoCapitalize="characters"
                />
              </View>

              {/* Capacity Selection */}
              <View className="mb-5">
                <Text className="text-gray-700 font-semibold text-base mb-3">
                  Sức chứa (số chỗ) <Text className="text-red-500">*</Text>
                </Text>
                
                {/* Quick Select Buttons */}
                <View className="flex-row gap-2.5 mb-3">
                  {[2, 4, 5, 7].map((num) => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => setCapacity(num)}
                      className={`flex-1 py-3.5 rounded-xl border-2 ${
                        capacity === num
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white border-gray-200'
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center justify-center">
                        <Text
                          className={`font-bold text-lg ${
                            capacity === num ? 'text-white' : 'text-gray-700'
                          }`}
                        >
                          {num}
                        </Text>
                        {capacity === num && (
                          <Check size={16} color="#FFF" strokeWidth={3} style={{ marginLeft: 4 }} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Custom Input */}
                <TextInput
                  value={capacity.toString()}
                  onChangeText={(text) => {
                    const num = parseInt(text);
                    if (!isNaN(num) && num > 0) setCapacity(num);
                  }}
                  placeholder="Hoặc nhập số chỗ khác"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
                />
              </View>

              {/* Info Box */}
              <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <View className="flex-row items-start">
                  <Info size={20} color="#3B82F6" className="mt-0.5" />
                  <View className="flex-1 ml-3">
                    <Text className="text-blue-900 font-semibold text-sm mb-2">
                      Lưu ý
                    </Text>
                    <Text className="text-blue-800 text-xs leading-5">
                      • Tối đa 3 phương tiện{'\n'}
                      • Biển số phải chính xác{'\n'}
                      • Ảnh xe giúp nhận diện dễ dàng
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 bg-gray-100 py-3.5 rounded-lg active:bg-gray-200"
                  activeOpacity={0.9}
                >
                  <Text className="text-gray-700 font-bold text-center text-base">Hủy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={saving || uploading}
                  className={`flex-1 py-3.5 rounded-lg ${
                    saving || uploading ? 'bg-gray-400' : 'bg-green-500 active:bg-green-600'
                  }`}
                  activeOpacity={0.9}
                >
                  {saving || uploading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="#FFF" />
                      <Text className="text-white font-bold ml-2">Đang lưu...</Text>
                    </View>
                  ) : (
                    <Text className="text-white font-bold text-center text-base">
                      {vehicle ? 'Cập nhật' : 'Thêm xe'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
