import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, Clock, DollarSign, Car } from 'lucide-react-native';

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  availableSpots: number;
  totalSpots: number;
  pricePerHour: number;
  distance?: string;
  rating?: number;
}

interface ParkingListItemProps {
  parkingLot: ParkingLot;
  onPress: () => void;
}

export default function ParkingListItem({ parkingLot, onPress }: ParkingListItemProps) {
  const availabilityPercentage = (parkingLot.availableSpots / parkingLot.totalSpots) * 100;
  const availabilityColor = 
    availabilityPercentage > 50 ? 'bg-green-500' : 
    availabilityPercentage > 20 ? 'bg-yellow-500' : 
    'bg-red-500';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 shadow-md"
      activeOpacity={0.8}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {parkingLot.name}
          </Text>
          <View className="flex-row items-center">
            <MapPin size={14} color="#9CA3AF" />
            <Text className="text-sm text-gray-500 ml-1 flex-1">
              {parkingLot.address}
            </Text>
          </View>
        </View>
        
        {parkingLot.distance && (
          <View className="bg-blue-50 rounded-lg px-3 py-1">
            <Text className="text-sm font-semibold text-blue-600">
              {parkingLot.distance}
            </Text>
          </View>
        )}
      </View>

      {/* Info Row */}
      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
        {/* Available Spots */}
        <View className="flex-row items-center">
          <View className={`${availabilityColor} rounded-full p-1.5 mr-2`}>
            <Car size={14} color="#FFF" />
          </View>
          <View>
            <Text className="text-xs text-gray-500">Chỗ trống</Text>
            <Text className="text-sm font-bold text-gray-800">
              {parkingLot.availableSpots}/{parkingLot.totalSpots}
            </Text>
          </View>
        </View>

        {/* Price */}
        <View className="flex-row items-center">
          <DollarSign size={16} color="#3B82F6" />
          <View className="ml-1">
            <Text className="text-xs text-gray-500">Giá/giờ</Text>
            <Text className="text-sm font-bold text-blue-600">
              {parkingLot.pricePerHour.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>

        {/* Rating */}
        {parkingLot.rating && (
          <View className="flex-row items-center">
            <Text className="text-lg mr-1">⭐</Text>
            <Text className="text-sm font-bold text-gray-800">
              {parkingLot.rating}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
