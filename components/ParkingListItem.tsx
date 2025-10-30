import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, Car, Shield, Camera } from 'lucide-react-native';
import type { ParkingLot } from '@/lib/parkingLot.api';

interface ParkingListItemProps {
  parkingLot: ParkingLot;
  onPress: () => void;
  distance?: number; // Distance in km
  availableSpots?: number; // Real-time available spots
}

export default function ParkingListItem({ 
  parkingLot, 
  onPress, 
  distance,
  availableSpots 
}: ParkingListItemProps) {
  const totalSlots = parkingLot.zones.reduce((total, zone) => total + zone.count, 0);
  const available = availableSpots ?? Math.floor(totalSlots * 0.7); // Mock if not provided
  const availabilityPercentage = (available / totalSlots) * 100;
  const availabilityColor = 
    availabilityPercentage > 50 ? 'bg-green-500' : 
    availabilityPercentage > 20 ? 'bg-yellow-500' : 
    'bg-red-500';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl mb-3 shadow-md overflow-hidden"
      activeOpacity={0.8}
    >
      {/* Image Section */}
      <View className="relative h-48">
        {parkingLot.avtImage ? (
          <Image
            source={{ uri: parkingLot.avtImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
            <Car size={48} color="#9CA3AF" />
          </View>
        )}
        
        {/* Status Badge */}
        {parkingLot.isActive && (
          <View className="absolute top-3 right-3 bg-green-500 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-semibold">Hoạt động</Text>
          </View>
        )}
        
        {/* Total Slots Badge */}
        <View className="absolute bottom-3 left-3 bg-black/70 rounded-full px-3 py-1">
          <Text className="text-white text-xs font-semibold">
            {totalSlots} chỗ đỗ
          </Text>
        </View>
        
        {/* Distance Badge */}
        {distance !== undefined && (
          <View className="absolute bottom-3 right-3 bg-blue-600/90 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-semibold">
              {distance.toFixed(1)} km
            </Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-start justify-between mb-2">
          <Text className="text-lg font-bold text-gray-800 flex-1 pr-2" numberOfLines={2}>
            {parkingLot.name}
          </Text>
          <View className="items-end">
            <Text className="text-lg font-bold text-blue-600">
              {parkingLot.pricePerHour?.toLocaleString('vi-VN') || '15,000'}đ
            </Text>
            <Text className="text-xs text-gray-500">mỗi giờ</Text>
          </View>
        </View>
        
        {/* Address */}
        <View className="flex-row items-start mb-3">
          <MapPin size={16} color="#9CA3AF" className="mt-0.5" />
          <Text className="text-sm text-gray-600 ml-2 flex-1" numberOfLines={2}>
            {parkingLot.address}
          </Text>
        </View>

        {/* Zones */}
        <View className="flex-row flex-wrap gap-2 mb-3">
          {parkingLot.zones.slice(0, 3).map((zone, index) => (
            <View key={index} className="bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
              <Text className="text-xs font-semibold text-blue-700">
                Khu {zone.zone}: {zone.count}
              </Text>
            </View>
          ))}
          {parkingLot.zones.length > 3 && (
            <View className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
              <Text className="text-xs font-semibold text-gray-600">
                +{parkingLot.zones.length - 3} khu
              </Text>
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <View className="flex-row flex-wrap gap-2 mb-3">
          {parkingLot.allowedPaymentMethods.map((method, index) => (
            <View key={index} className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
              <Text className="text-xs font-semibold text-gray-700">
                {method === 'prepaid' ? '💳 Trả trước' : '💰 Trả tại bãi'}
              </Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <View className="flex-row items-center gap-4 mb-4">
          <View className="flex-row items-center gap-1">
            <Shield size={14} color="#10B981" />
            <Text className="text-xs text-gray-600">Bảo mật</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Camera size={14} color="#3B82F6" />
            <Text className="text-xs text-gray-600">Camera</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock size={14} color="#F59E0B" />
            <Text className="text-xs text-gray-600">24/7</Text>
          </View>
        </View>

        {/* Bottom Info */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
          {/* Available Spots */}
          <View className="flex-row items-center">
            <View className={`${availabilityColor} rounded-full p-1.5 mr-2`}>
              <Car size={12} color="#FFF" />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Chỗ trống</Text>
              <Text className="text-sm font-bold text-gray-800">
                {available}/{totalSlots}
              </Text>
            </View>
          </View>

          {/* Updated Date */}
          <Text className="text-xs text-gray-400">
            {new Date(parkingLot.updatedAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
