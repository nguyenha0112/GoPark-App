import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Car, Plus, Edit, Trash2 } from 'lucide-react-native';
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
  const [refreshing, setRefreshing] = useState(false);
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
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVehicles();
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
        <View className="flex-1 bg-white items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
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
          title: 'Phương tiện của tôi',
          headerStyle: {
            backgroundColor: '#10B981',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-3">
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View className="mr-3 bg-white/20 px-2.5 py-1 rounded-md">
              <Text className="text-white font-bold text-sm">
                {vehicles.length}/3
              </Text>
            </View>
          ),
        }}
      />

      <ScrollView 
        className="flex-1 bg-gray-50"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />
        }
      >
        {vehicles.length === 0 ? (
          <View className="items-center justify-center py-20 px-6">
            <View className="bg-green-50 w-20 h-20 rounded-full items-center justify-center mb-4">
              <Car size={40} color="#10B981" strokeWidth={2} />
            </View>
            
            <Text className="text-gray-800 text-lg font-bold mb-2 text-center">
              Chưa có phương tiện
            </Text>
            <Text className="text-gray-500 text-sm text-center mb-6">
              Thêm xe để sử dụng dịch vụ
            </Text>

            <TouchableOpacity
              onPress={() => setShowFormModal(true)}
              className="bg-green-500 px-6 py-3 rounded-lg active:bg-green-600"
              activeOpacity={0.9}
            >
              <View className="flex-row items-center">
                <Plus size={20} color="#FFF" strokeWidth={2.5} />
                <Text className="text-white font-semibold ml-2">Thêm xe</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="p-4">
            {vehicles.map((vehicle, index) => (
              <View
                key={vehicle._id}
                className="bg-white rounded-xl mb-3"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                {/* Vehicle Image */}
                {vehicle.imageVehicle ? (
                  <Image
                    source={{ uri: vehicle.imageVehicle }}
                    className="w-full h-40 rounded-t-xl"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-40 bg-gray-100 rounded-t-xl items-center justify-center">
                    <Car size={40} color="#9CA3AF" strokeWidth={2} />
                  </View>
                )}

                {/* Vehicle Info */}
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-gray-500 text-xs mb-1">Biển số xe</Text>
                      <Text className="text-gray-900 font-bold text-xl">
                        {vehicle.licensePlate}
                      </Text>
                    </View>
                    <View className="bg-green-50 px-2.5 py-1 rounded-md">
                      <Text className="text-green-600 font-semibold text-xs">
                        #{index + 1}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-gray-50 rounded-lg p-2.5 mb-3">
                    <Text className="text-gray-600 text-sm">
                      Sức chứa: <Text className="font-semibold text-gray-900">{vehicle.capacity} chỗ</Text>
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => openEditModal(vehicle)}
                      className="flex-1 bg-blue-500 py-2.5 rounded-lg active:bg-blue-600"
                      activeOpacity={0.9}
                    >
                      <View className="flex-row items-center justify-center">
                        <Edit size={16} color="#FFF" strokeWidth={2} />
                        <Text className="text-white font-semibold text-sm ml-1.5">Sửa</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => handleDeleteVehicle(vehicle._id)}
                      className="flex-1 bg-red-500 py-2.5 rounded-lg active:bg-red-600"
                      activeOpacity={0.9}
                    >
                      <View className="flex-row items-center justify-center">
                        <Trash2 size={16} color="#FFF" strokeWidth={2} />
                        <Text className="text-white font-semibold text-sm ml-1.5">Xóa</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Add New Vehicle Card */}
            {vehicles.length < 3 && (
              <TouchableOpacity
                onPress={() => setShowFormModal(true)}
                className="bg-white rounded-xl border-2 border-dashed border-green-300 p-6"
                activeOpacity={0.7}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                <View className="items-center">
                  <View className="bg-green-50 w-16 h-16 rounded-full items-center justify-center mb-3">
                    <Plus size={32} color="#10B981" strokeWidth={2.5} />
                  </View>
                  <Text className="text-green-600 font-bold text-base mb-1">
                    Thêm phương tiện mới
                  </Text>
                  <Text className="text-gray-500 text-xs text-center">
                    Bạn có thể đăng ký tối đa 3 xe
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        <View className="h-4" />
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
