import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Car, Plus, Edit2, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/lib/api';
import VehicleFormModal from '@/components/VehicleFormModal';

interface Vehicle {
  _id: string;
  licensePlate: string;
  capacity: number;
  imageVehicle?: string;
  userId?: string;
}

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
        router.replace('/(auth)/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/vehicles/my-vehicles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setVehicles(result.data || []);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách phương tiện');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa phương tiện này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(
                `${BASE_URL}/api/v1/vehicles/${vehicleId}`,
                {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                Alert.alert('Thành công', 'Xóa xe thành công');
                loadVehicles();
              } else {
                throw new Error('Không thể xóa xe');
              }
            } catch (error: any) {
              Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditingVehicle(null);
  };

  const handleFormSuccess = () => {
    loadVehicles();
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 bg-gray-50 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-gray-600 mt-4">Đang tải...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Xe của tôi',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowFormModal(true)}
              disabled={vehicles.length >= 3}
              className={`ml-4 p-2 rounded-full ${
                vehicles.length >= 3 ? 'bg-gray-200' : 'bg-green-100'
              }`}
            >
              <Plus size={20} color={vehicles.length >= 3 ? '#9CA3AF' : '#22c55e'} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        {vehicles.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Car size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">Chưa có phương tiện nào</Text>
            <Text className="text-gray-400 text-sm mt-2">Tối đa 3 phương tiện</Text>
            <TouchableOpacity
              onPress={() => setShowFormModal(true)}
              className="bg-green-500 px-6 py-3 rounded-lg mt-4"
            >
              <Text className="text-white font-semibold">Thêm xe đầu tiên</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="p-4">
            {vehicles.length >= 3 && (
              <View className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex-row items-center">
                <Text className="text-amber-800 text-sm flex-1">
                  ⚠️ Bạn đã đạt giới hạn 3 phương tiện
                </Text>
              </View>
            )}
            {vehicles.map((vehicle) => (
              <View
                key={vehicle._id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                {/* Vehicle Image */}
                {vehicle.imageVehicle ? (
                  <Image
                    source={{ uri: vehicle.imageVehicle }}
                    className="w-full h-40 rounded-lg mb-3"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-40 bg-gray-100 rounded-lg mb-3 items-center justify-center">
                    <Car size={48} color="#D1D5DB" />
                    <Text className="text-gray-400 text-sm mt-2">Chưa có ảnh</Text>
                  </View>
                )}

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3">
                      <Car size={24} color="#22c55e" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-bold text-lg">
                        {vehicle.licensePlate}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        Sức chứa: {vehicle.capacity} chỗ
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => openEditModal(vehicle)}
                      className="bg-blue-50 p-2 rounded-lg"
                    >
                      <Edit2 size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteVehicle(vehicle._id)}
                      className="bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Vehicle Form Modal */}
      <VehicleFormModal
        visible={showFormModal}
        onClose={handleCloseModal}
        onSuccess={handleFormSuccess}
        vehicle={editingVehicle}
        vehiclesCount={vehicles.length}
      />
    </>
  );
}
