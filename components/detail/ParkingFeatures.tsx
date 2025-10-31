import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import { Shield, Camera, CreditCard, Wifi, User, Phone, Mail, MapPin, Clock, Star } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ParkingLot } from '@/lib/parkingLot.api';
import { BASE_URL } from '@/lib/api';

interface ParkingFeaturesProps {
  parkingLot: ParkingLot;
}

interface Owner {
  userName: string;
  email: string;
  phoneNumber: string;
}

export default function ParkingFeatures({ parkingLot }: ParkingFeaturesProps) {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loadingOwner, setLoadingOwner] = useState(true);

  useEffect(() => {
    loadOwnerInfo();
  }, [parkingLot._id]);

  const loadOwnerInfo = async () => {
    if (!parkingLot.parkingOwner) {
      console.log('⚠️ No parkingOwner');
      setLoadingOwner(false);
      return;
    }

    try {
      const ownerId = typeof parkingLot.parkingOwner === 'string' 
        ? parkingLot.parkingOwner 
        : (parkingLot.parkingOwner as any)._id;
      
      console.log('🔗 Fetching owner:', ownerId);
      
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('⚠️ No auth token');
        setLoadingOwner(false);
        return;
      }

      const url = `${BASE_URL}/api/v1/users/${ownerId}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Owner response:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Owner data:', result);
        
        const userData = result.data || result;
        
        setOwner({
          userName: userData.userName || 'Không có tên',
          email: userData.email || 'Không có email',
          phoneNumber: userData.phoneNumber || 'Không có SĐT',
        });
      } else {
        console.log('❌ Failed:', response.status);
      }
    } catch (error) {
      console.log('❌ Error:', error);
    } finally {
      setLoadingOwner(false);
    }
  };

  const handleCall = () => {
    if (owner?.phoneNumber) {
      Linking.openURL(`tel:${owner.phoneNumber}`);
    }
  };

  const handleEmail = () => {
    if (owner?.email) {
      Linking.openURL(`mailto:${owner.email}`);
    }
  };

  return (
    <View className="bg-white">
      {/* Thông tin cơ bản */}
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900 mb-3">{parkingLot.name}</Text>
        
        <View className="flex-row items-start mb-2">
          <MapPin size={16} color="#6B7280" className="mt-0.5" />
          <Text className="text-sm text-gray-600 ml-2 flex-1">{parkingLot.address}</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Clock size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">Mở cửa: 24/7</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Star size={16} color="#F59E0B" />
          <Text className="text-sm text-gray-600 ml-2">4.8 / 5.0</Text>
        </View>

        <View className="mt-2 pt-2 border-t border-gray-100">
          <Text className="text-lg font-bold text-green-600">
            {parkingLot.pricePerHour?.toLocaleString('vi-VN')} VNĐ/giờ
          </Text>
        </View>
      </View>

      {/* Mô tả */}
      {parkingLot.description && (
        <View className="px-4 py-3 border-b border-gray-100">
          <Text className="text-base font-semibold text-gray-900 mb-2">Mô tả</Text>
          <Text className="text-sm text-gray-600 leading-6">{parkingLot.description}</Text>
        </View>
      )}

      {/* Khu vực */}
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-base font-semibold text-gray-900 mb-3">Khu vực đỗ xe</Text>
        <View className="flex-row flex-wrap gap-2">
          {parkingLot.zones.map((zone, index) => (
            <View key={index} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Text className="text-sm font-medium text-gray-700">
                Khu {zone.zone}: {zone.count} chỗ
              </Text>
            </View>
          ))}
        </View>
        <Text className="text-xs text-gray-500 mt-2">
          Tổng: {parkingLot.zones.reduce((sum, z) => sum + z.count, 0)} vị trí
        </Text>
      </View>

      {/* Tiện ích */}
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-base font-semibold text-gray-900 mb-3">Tiện ích</Text>
        <View className="flex-row flex-wrap gap-2">
          <View className="flex-row items-center bg-green-50 rounded-lg px-3 py-2">
            <Shield size={18} color="#22c55e" />
            <Text className="text-sm text-gray-700 ml-2">Bảo mật 24/7</Text>
          </View>

          <View className="flex-row items-center bg-green-50 rounded-lg px-3 py-2">
            <Camera size={18} color="#22c55e" />
            <Text className="text-sm text-gray-700 ml-2">Camera</Text>
          </View>

          <View className="flex-row items-center bg-green-50 rounded-lg px-3 py-2">
            <Wifi size={18} color="#22c55e" />
            <Text className="text-sm text-gray-700 ml-2">WiFi miễn phí</Text>
          </View>

          <View className="flex-row items-center bg-green-50 rounded-lg px-3 py-2">
            <CreditCard size={18} color="#22c55e" />
            <Text className="text-sm text-gray-700 ml-2">Thanh toán online</Text>
          </View>
        </View>
      </View>

      {/* Phương thức thanh toán */}
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-base font-semibold text-gray-900 mb-3">Phương thức thanh toán</Text>
        <View className="flex-row flex-wrap gap-2">
          {parkingLot.allowedPaymentMethods.map((method, index) => (
            <View key={index} className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <Text className="text-sm font-medium text-green-700">
                {method === 'prepaid' ? '💳 Trả trước' : '💰 Trả tại bãi'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Thông tin chủ bãi */}
      <View className="px-4 py-3">
        <Text className="text-base font-semibold text-gray-900 mb-3">Thông tin chủ bãi</Text>
        
        {loadingOwner ? (
          <View className="flex-row items-center py-3">
            <ActivityIndicator size="small" color="#22c55e" />
            <Text className="text-sm text-gray-500 ml-2">Đang tải thông tin...</Text>
          </View>
        ) : owner ? (
          <View className="bg-gray-50 rounded-lg p-3">
            <View className="flex-row items-center mb-2">
              <View className="bg-green-500 rounded-full p-2">
                <User size={16} color="#FFF" />
              </View>
              <Text className="text-sm font-medium text-gray-900 ml-2">{owner.userName}</Text>
            </View>

            <TouchableOpacity 
              onPress={handleCall}
              className="flex-row items-center py-2 border-t border-gray-200"
              activeOpacity={0.7}
            >
              <Phone size={16} color="#22c55e" />
              <Text className="text-sm text-gray-700 ml-2">{owner.phoneNumber}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleEmail}
              className="flex-row items-center py-2 border-t border-gray-200"
              activeOpacity={0.7}
            >
              <Mail size={16} color="#22c55e" />
              <Text className="text-sm text-gray-700 ml-2">{owner.email}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-gray-50 rounded-lg p-3">
            <Text className="text-sm text-gray-500">Không thể tải thông tin chủ bãi</Text>
          </View>
        )}
      </View>
    </View>
  );
}
