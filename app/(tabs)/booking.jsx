import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://192.168.1.8:5000';

export default function Booking() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        // If not logged in, show empty state
        setBookings([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/bookings/my-bookings`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('My bookings:', result);
        setBookings(result.data || []);
      } else {
        throw new Error('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đặt chỗ');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: CheckCircle,
          color: '#10B981',
          bgColor: '#D1FAE5',
          text: 'Đã xác nhận',
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: '#F59E0B',
          bgColor: '#FEF3C7',
          text: 'Chờ xác nhận',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: '#EF4444',
          bgColor: '#FEE2E2',
          text: 'Đã hủy',
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: '#6B7280',
          bgColor: '#F3F4F6',
          text: 'Hoàn thành',
        };
      default:
        return {
          icon: AlertCircle,
          color: '#6B7280',
          bgColor: '#F3F4F6',
          text: status,
        };
    }
  };

  const handleNewBooking = () => {
    // Navigate to home page to select parking lot
    router.push('/(tabs)/home');
  };

  const handleBookingDetail = (booking) => {
    // TODO: Navigate to booking detail page
    Alert.alert('Chi tiết đặt chỗ', `Booking ID: ${booking._id}`);
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
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Đặt chỗ của tôi</Text>
        <Text className="text-gray-600 mt-1">
          {bookings.length} đặt chỗ
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {bookings.length === 0 ? (
          // Empty state
          <View className="flex-1 items-center justify-center py-20 px-6">
            <View className="bg-purple-100 rounded-full p-6 mb-6">
              <Calendar size={64} color="#8B5CF6" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Chưa có đặt chỗ nào
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Bắt đầu đặt chỗ để đảm bảo có chỗ đỗ xe khi bạn cần
            </Text>
            <TouchableOpacity
              onPress={handleNewBooking}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl py-4 px-8 flex-row items-center"
            >
              <Plus size={20} color="#FFF" />
              <Text className="text-white font-bold text-base ml-2">
                Đặt chỗ ngay
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Bookings list
          <View className="p-4">
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <TouchableOpacity
                  key={booking._id}
                  onPress={() => handleBookingDetail(booking)}
                  className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
                  activeOpacity={0.7}
                >
                  {/* Status badge */}
                  <View
                    className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-100"
                  >
                    <View
                      className="flex-row items-center px-3 py-1 rounded-full"
                      style={{ backgroundColor: statusConfig.bgColor }}
                    >
                      <StatusIcon size={16} color={statusConfig.color} />
                      <Text
                        className="font-semibold text-sm ml-1"
                        style={{ color: statusConfig.color }}
                      >
                        {statusConfig.text}
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-sm">
                      #{booking._id.slice(-6)}
                    </Text>
                  </View>

                  {/* Parking lot info */}
                  <View className="flex-row items-start mb-2">
                    <MapPin size={18} color="#8B5CF6" />
                    <View className="flex-1 ml-2">
                      <Text className="text-gray-800 font-semibold text-base">
                        {booking.parkingLotId?.name || 'N/A'}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1">
                        Chỗ: {booking.parkingSlotId?.slotNumber || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Time info */}
                  <View className="flex-row items-center mb-2">
                    <Calendar size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">
                      {formatDateTime(booking.startTime)}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Clock size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">
                      đến {formatDateTime(booking.endTime)}
                    </Text>
                  </View>

                  {/* Vehicle info */}
                  <View className="flex-row items-center mb-3">
                    <Car size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">
                      {booking.vehicleId?.licensePlate || 'N/A'}
                    </Text>
                  </View>

                  {/* Price */}
                  <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <Text className="text-gray-600 text-sm">Tổng tiền</Text>
                    <Text className="text-purple-600 font-bold text-lg">
                      {booking.totalPrice?.toLocaleString('vi-VN') || '0'}đ
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating action button */}
      {bookings.length > 0 && (
        <TouchableOpacity
          onPress={handleNewBooking}
          className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-4 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Plus size={28} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
