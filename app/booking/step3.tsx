import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
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
  CreditCard,
  Wallet,
  CheckCircle,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://192.168.1.8:5000';

type PaymentMethod = 'cash' | 'prepaid';

export default function BookingStep3() {
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
    vehicleId,
    licensePlate,
    vehicleType,
  } = useLocalSearchParams<{
    parkingLotId: string;
    parkingLotName: string;
    slotId: string;
    slotNumber: string;
    zoneName: string;
    startTime: string;
    endTime: string;
    estimatedPrice: string;
    vehicleId: string;
    licensePlate: string;
    vehicleType: string;
  }>();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Format date and time
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

  // Create booking
  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục');
        router.replace('/(auth)/login');
        return;
      }

      // Prepare booking data
      const bookingData = {
        parkingLotId,
        slotId,
        vehicleId,
        startTime,
        endTime,
        paymentMethod: paymentMethod === 'prepaid' ? 'online' : 'cash',
        estimatedPrice: parseInt(estimatedPrice),
      };

      console.log('Creating booking:', bookingData);

      const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo đặt chỗ');
      }

      const result = await response.json();
      console.log('Booking created successfully:', result);

      // Show success modal
      setShowSuccessModal(true);

      // If prepaid, navigate to payment page
      if (paymentMethod === 'prepaid' && result.data?.paymentUrl) {
        // TODO: Navigate to payment WebView
        // For now, just show success
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      Alert.alert(
        'Lỗi',
        error.message || 'Không thể tạo đặt chỗ. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navigate to booking history or home
    router.replace('/(tabs)/booking');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-purple-600 to-blue-600 pt-12 pb-6 px-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/20 rounded-full p-2 mr-3"
            disabled={loading}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white font-bold text-xl">Đặt chỗ - Bước 3/3</Text>
            <Text className="text-white/80 text-sm">Thanh toán & xác nhận</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Booking Summary */}
        <View className="bg-white m-4 rounded-2xl p-4 shadow-sm">
          <Text className="font-bold text-lg text-gray-800 mb-4">
            Xác nhận thông tin
          </Text>

          {/* Parking lot info */}
          <View className="flex-row items-start mb-3 pb-3 border-b border-gray-100">
            <MapPin size={20} color="#8B5CF6" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Bãi đỗ xe</Text>
              <Text className="text-gray-800 font-semibold">{parkingLotName}</Text>
            </View>
          </View>

          {/* Slot info */}
          <View className="flex-row items-start mb-3 pb-3 border-b border-gray-100">
            <ParkingSquare size={20} color="#8B5CF6" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Chỗ đỗ</Text>
              <Text className="text-gray-800 font-semibold">
                {slotNumber} - {zoneName}
              </Text>
            </View>
          </View>

          {/* Vehicle info */}
          <View className="flex-row items-start mb-3 pb-3 border-b border-gray-100">
            <Car size={20} color="#8B5CF6" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Xe</Text>
              <Text className="text-gray-800 font-semibold">
                {licensePlate} ({vehicleType})
              </Text>
            </View>
          </View>

          {/* Time info */}
          <View className="flex-row items-start mb-3 pb-3 border-b border-gray-100">
            <Calendar size={20} color="#8B5CF6" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Thời gian</Text>
              <Text className="text-gray-800 font-semibold">
                {formatDateTime(startTime)}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">đến</Text>
              <Text className="text-gray-800 font-semibold">
                {formatDateTime(endTime)}
              </Text>
            </View>
          </View>

          {/* Duration */}
          <View className="flex-row items-start mb-3 pb-3 border-b border-gray-100">
            <Clock size={20} color="#8B5CF6" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Thời lượng</Text>
              <Text className="text-gray-800 font-semibold">{getDuration()} giờ</Text>
            </View>
          </View>

          {/* Price info */}
          <View className="flex-row items-start">
            <DollarSign size={20} color="#8B5CF6" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-500 text-xs mb-1">Tổng tiền</Text>
              <Text className="text-purple-600 font-bold text-2xl">
                {parseInt(estimatedPrice).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View className="bg-white mx-4 mb-4 rounded-2xl p-4 shadow-sm">
          <Text className="font-bold text-lg text-gray-800 mb-4">
            Phương thức thanh toán
          </Text>

          {/* Pay at parking */}
          <TouchableOpacity
            onPress={() => setPaymentMethod('cash')}
            className={`mb-3 p-4 rounded-xl border-2 flex-row items-center ${
              paymentMethod === 'cash'
                ? 'bg-purple-50 border-purple-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <View
              className={`rounded-full p-3 ${
                paymentMethod === 'cash' ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <Wallet size={24} color={paymentMethod === 'cash' ? '#FFF' : '#6B7280'} />
            </View>

            <View className="flex-1 ml-4">
              <Text
                className={`font-bold text-base ${
                  paymentMethod === 'cash' ? 'text-purple-700' : 'text-gray-800'
                }`}
              >
                Thanh toán tại bãi
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Thanh toán trực tiếp khi ra khỏi bãi
              </Text>
            </View>

            {paymentMethod === 'cash' && (
              <View className="bg-purple-600 rounded-full p-1">
                <Text className="text-white text-xs font-bold px-2">✓</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Prepaid */}
          <TouchableOpacity
            onPress={() => setPaymentMethod('prepaid')}
            className={`p-4 rounded-xl border-2 flex-row items-center ${
              paymentMethod === 'prepaid'
                ? 'bg-purple-50 border-purple-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <View
              className={`rounded-full p-3 ${
                paymentMethod === 'prepaid' ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <CreditCard
                size={24}
                color={paymentMethod === 'prepaid' ? '#FFF' : '#6B7280'}
              />
            </View>

            <View className="flex-1 ml-4">
              <Text
                className={`font-bold text-base ${
                  paymentMethod === 'prepaid' ? 'text-purple-700' : 'text-gray-800'
                }`}
              >
                Thanh toán trước
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Thanh toán online qua VNPay, MoMo, ZaloPay
              </Text>
              <View className="bg-green-100 rounded-lg px-2 py-1 mt-2 self-start">
                <Text className="text-green-700 font-semibold text-xs">Giảm 5%</Text>
              </View>
            </View>

            {paymentMethod === 'prepaid' && (
              <View className="bg-purple-600 rounded-full p-1">
                <Text className="text-white text-xs font-bold px-2">✓</Text>
              </View>
            )}
          </TouchableOpacity>

          {paymentMethod === 'prepaid' && (
            <View className="mt-3 bg-green-50 rounded-xl p-3">
              <Text className="text-green-800 font-semibold text-sm">
                💰 Tiết kiệm:{' '}
                {Math.round(parseInt(estimatedPrice) * 0.05).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          )}
        </View>

        {/* Terms and Conditions */}
        <View className="bg-yellow-50 mx-4 mb-4 rounded-2xl p-4">
          <Text className="text-yellow-800 font-semibold mb-2">⚠️ Điều khoản</Text>
          <Text className="text-yellow-700 text-sm leading-5">
            • Vui lòng đến đúng giờ đã đặt{'\n'}
            • Hủy đặt chỗ trước ít nhất 1 giờ để được hoàn tiền{'\n'}
            • Nếu đến muộn quá 30 phút, đặt chỗ sẽ bị hủy tự động{'\n'}
            • Giữ biển số xe khớp với thông tin đã đăng ký
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="bg-white border-t border-gray-200 p-4">
        <TouchableOpacity
          onPress={handleConfirmBooking}
          disabled={loading}
          className={`rounded-2xl py-4 px-6 ${
            loading ? 'bg-gray-300' : 'bg-gradient-to-r from-purple-600 to-blue-600'
          }`}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text className="text-white font-bold text-center text-lg">
              Xác nhận đặt chỗ
            </Text>
          )}
        </TouchableOpacity>

        <Text className="text-center text-gray-500 text-xs mt-3">
          Bằng việc đặt chỗ, bạn đồng ý với điều khoản sử dụng
        </Text>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessModalClose}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <View className="items-center mb-6">
              <View className="bg-green-100 rounded-full p-4 mb-4">
                <CheckCircle size={64} color="#10B981" />
              </View>
              <Text className="text-gray-800 font-bold text-2xl mb-2">
                Đặt chỗ thành công!
              </Text>
              <Text className="text-gray-600 text-center">
                Chúc bạn có trải nghiệm tốt với GoPark
              </Text>
            </View>

            <View className="bg-purple-50 rounded-xl p-4 mb-6">
              <Text className="text-purple-800 font-semibold mb-2">
                📍 {parkingLotName}
              </Text>
              <Text className="text-purple-700 text-sm">
                Chỗ: {slotNumber} • {formatDateTime(startTime)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSuccessModalClose}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl py-4"
            >
              <Text className="text-white font-bold text-center text-lg">
                Xem đặt chỗ của tôi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/(tabs)/home');
              }}
              className="mt-3"
            >
              <Text className="text-gray-500 text-center">Về trang chủ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
