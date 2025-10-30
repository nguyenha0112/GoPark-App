import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { MapPin, Clock, Star } from 'lucide-react-native';
import type { ParkingLot } from '@/lib/parkingLot.api';

interface ParkingDetailHeaderProps {
  parkingLot: ParkingLot;
}

const { width } = Dimensions.get('window');

export default function ParkingDetailHeader({ parkingLot }: ParkingDetailHeaderProps) {
  const totalSlots = parkingLot.zones.reduce((sum, zone) => sum + zone.count, 0);

  return (
    <View className="bg-white">
      {/* Image Carousel */}
      <View>
        {parkingLot.avtImage ? (
          <Image
            source={{ uri: parkingLot.avtImage }}
            style={{ width, height: 250 }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width, height: 250 }} className="bg-gray-200 items-center justify-center">
            <Text className="text-gray-400">Không có ảnh</Text>
          </View>
        )}
        
        {/* Status Badge */}
        {parkingLot.isActive && (
          <View className="absolute top-4 right-4 bg-green-500 rounded-full px-3 py-1.5">
            <Text className="text-white text-xs font-semibold">Đang hoạt động</Text>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-3">
          {parkingLot.name}
        </Text>

        {/* Address */}
        <View className="flex-row items-start mb-3">
          <MapPin size={18} color="#6B7280" className="mt-0.5" />
          <Text className="text-gray-600 ml-2 flex-1">
            {parkingLot.address}
          </Text>
        </View>

        {/* Operating Hours */}
        <View className="flex-row items-center mb-3">
          <Clock size={18} color="#6B7280" />
          <Text className="text-gray-600 ml-2">Mở cửa: 24/7</Text>
        </View>

        {/* Rating */}
        <View className="flex-row items-center mb-3">
          <Star size={18} color="#FBBF24" fill="#FBBF24" />
          <Text className="text-gray-800 font-semibold ml-2">4.8</Text>
          <Text className="text-gray-500 ml-1">(127 đánh giá)</Text>
        </View>

        {/* Price */}
        <View className="bg-blue-50 rounded-lg p-3 mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600">Giá đỗ xe:</Text>
            <Text className="text-2xl font-bold text-blue-600">
              {parkingLot.pricePerHour?.toLocaleString('vi-VN') || '15,000'}đ
              <Text className="text-base text-gray-500">/giờ</Text>
            </Text>
          </View>
        </View>

        {/* Total Slots */}
        <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
          <Text className="text-gray-600">Tổng số chỗ đỗ:</Text>
          <Text className="text-lg font-bold text-gray-900">{totalSlots} chỗ</Text>
        </View>
      </View>
    </View>
  );
}
