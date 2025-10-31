import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Car,
  Calendar,
  Clock,
  MapPin,
  ParkingSquare,
  DollarSign,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://192.168.1.8:5000';

interface Vehicle {
  _id: string;
  licensePlate: string;
  capacity: number;
  imageVehicle?: string;
}

export default function BookingStep2() {
  const router = useRouter();
  const {
    parkingLotId,
    parkingLotName,
    slotId,
    slotNumber,
    zoneName,
    startTime,
    endTime,
    estimatedPrice,
  } = useLocalSearchParams<{
    parkingLotId: string;
    parkingLotName: string;
    slotId: string;
    slotNumber: string;
    zoneName: string;
    startTime: string;
    endTime: string;
    estimatedPrice: string;
  }>();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch người dùng vehicles
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục');
          router.replace('/(auth)/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/vehicles/my-vehicles`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Vehicles response:', result);
        const vehiclesData = result.data || result || [];
        setVehicles(vehiclesData);

        // tự động chọn xe đầu tiên nếu có
        if (vehiclesData && vehiclesData.length > 0) {
          setSelectedVehicle(vehiclesData[0]);
        }
      } catch (error) {
        console.error('Error loading vehicles:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách xe');
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // Format date và time
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = () => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return diffHours;
  };

  // Handle next step
  const handleNext = () => {
    if (!selectedVehicle) {
      Alert.alert('Thông báo', 'Vui lòng chọn xe');
      return;
    }

    // Navigate đi tới bước 3
    router.push({
      pathname: '/booking/step3',
      params: {
        parkingLotId,
        parkingLotName,
        slotId,
        slotNumber,
        zoneName,
        startTime,
        endTime,
        estimatedPrice,
        vehicleId: selectedVehicle._id,
        licensePlate: selectedVehicle.licensePlate,
        vehicleCapacity: selectedVehicle.capacity,
      },
    } as any);
  };

  // Handle add new vehicle
  const handleAddVehicle = () => {
    Alert.alert(
      'Thêm xe mới',
      'Chức năng này sẽ chuyển bạn đến trang quản lý xe. Bạn có muốn tiếp tục?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: () => {
            router.push('/vehicles');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-gray-600 mt-4">Đang tải...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-4 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-100 rounded-full p-2 mr-3"
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <View className="bg-black rounded px-2 py-1 mr-2">
                <Text className="text-white font-bold text-xs">BƯỚC 2/3</Text>
              </View>
            </View>
            <Text className="text-gray-900 font-bold text-xl">Chọn xe & xác nhận</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Booking Summary */}
        <View className="bg-white m-4 rounded-2xl p-4 shadow-sm">
          <Text className="font-bold text-lg text-gray-800 mb-4">
            Thông tin đặt chỗ
          </Text>

          {/* Parking lot info */}
          <View className="flex-row items-start mb-3 pb-3 border-b border-gray-100">
            <MapPin size={20} color="#000" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Bãi đỗ xe</Text>
              <Text className="text-gray-900 font-semibold">{parkingLotName}</Text>
            </View>
          </View>

          {/* Slot info */}
          <View className="flex-row items-start mb-3 pb-3 border-b border-gray-100">
            <ParkingSquare size={20} color="#000" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Chỗ đỗ</Text>
              <Text className="text-gray-900 font-semibold">
                {slotNumber} - {zoneName}
              </Text>
            </View>
          </View>

          {/* Time info */}
          <View className="flex-row items-start mb-3 pb-3 border-b border-gray-100">
            <Calendar size={20} color="#000" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Thời gian bắt đầu</Text>
              <Text className="text-gray-900 font-semibold">{formatDateTime(startTime)}</Text>
            </View>
          </View>

          <View className="flex-row items-start mb-3 pb-3 border-b border-gray-100">
            <Clock size={20} color="#000" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Thời gian kết thúc</Text>
              <Text className="text-gray-900 font-semibold">{formatDateTime(endTime)}</Text>
            </View>
          </View>

          {/* Price info */}
          <View className="flex-row items-start">
            <DollarSign size={20} color="#000" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Tổng tiền ({getDuration()} giờ)</Text>
              <Text className="text-gray-900 font-bold text-xl">
                {parseInt(estimatedPrice).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </View>
        </View>

        {/* Vehicle Selection */}
        <View className="bg-white mx-4 mb-4 rounded-2xl p-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-lg text-gray-800">Chọn xe</Text>
            <TouchableOpacity
              onPress={handleAddVehicle}
              className="bg-purple-100 rounded-lg px-3 py-1"
            >
              <Text className="text-purple-600 font-semibold text-sm">+ Thêm xe</Text>
            </TouchableOpacity>
          </View>

          {vehicles.length === 0 ? (
            <View className="py-8">
              <Car size={48} color="#D1D5DB" style={{ alignSelf: 'center', marginBottom: 12 }} />
              <Text className="text-center text-gray-500 mb-4">
                Bạn chưa có xe nào được đăng ký
              </Text>
              <TouchableOpacity
                onPress={handleAddVehicle}
                className="bg-purple-600 rounded-xl py-3 px-6 mx-auto"
              >
                <Text className="text-white font-semibold">Thêm xe ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle._id}
                onPress={() => setSelectedVehicle(vehicle)}
                className={`mb-3 p-4 rounded-lg border-2 flex-row items-center ${
                  selectedVehicle?._id === vehicle._id
                    ? 'bg-green-50 border-green-400'
                    : 'bg-white border-gray-300'
                }`}
              >
                <View
                  className={`rounded-full p-3 ${
                    selectedVehicle?._id === vehicle._id ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                >
                  <Car
                    size={24}
                    color={selectedVehicle?._id === vehicle._id ? '#FFF' : '#000'}
                  />
                </View>

                <View className="flex-1 ml-4">
                  <Text
                    className={`font-bold text-lg ${
                      selectedVehicle?._id === vehicle._id ? 'text-green-700' : 'text-gray-900'
                    }`}
                  >
                    {vehicle.licensePlate}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Sức chứa: {vehicle.capacity} chỗ
                  </Text>
                  {vehicle.imageVehicle && (
                    <Text className="text-gray-400 text-xs mt-1" numberOfLines={1}>
                      Có ảnh
                    </Text>
                  )}
                </View>

                {selectedVehicle?._id === vehicle._id && (
                  <View className="bg-green-400 rounded-full p-1">
                    <Text className="text-white text-xs font-bold px-2">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Additional Info */}
        <View className="bg-blue-50 mx-4 mb-4 rounded-2xl p-4">
          <Text className="text-blue-800 font-semibold mb-2">📋 Lưu ý</Text>
          <Text className="text-blue-700 text-sm leading-5">
            • Vui lòng đảm bảo biển số xe chính xác để thuận tiện khi vào/ra bãi{'\n'}
            • Nếu muốn thay đổi xe, vui lòng hủy đặt chỗ và đặt lại{'\n'}
            • Xe phải khớp với loại xe đã đăng ký
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="bg-white border-t border-gray-200 p-4">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedVehicle}
          className={`rounded-lg py-4 px-6 ${
            selectedVehicle
              ? 'bg-black'
              : 'bg-gray-300'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-center text-lg">Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
