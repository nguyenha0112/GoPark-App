import React from 'react';
import { View, Text } from 'react-native';
import { Shield, Camera, CreditCard, Wifi } from 'lucide-react-native';
import type { ParkingLot } from '@/lib/parkingLot.api';

interface ParkingFeaturesProps {
  parkingLot: ParkingLot;
}

export default function ParkingFeatures({ parkingLot }: ParkingFeaturesProps) {
  return (
    <View className="bg-white p-4 mt-2">
      <Text className="text-lg font-bold text-gray-900 mb-4">Tiện ích</Text>

      {/* Features Grid */}
      <View className="flex-row flex-wrap gap-3">
        <View className="flex-row items-center bg-green-50 rounded-lg px-3 py-2 flex-1 min-w-[45%]">
          <Shield size={20} color="#10B981" />
          <Text className="text-sm text-gray-700 ml-2">Bảo mật 24/7</Text>
        </View>

        <View className="flex-row items-center bg-blue-50 rounded-lg px-3 py-2 flex-1 min-w-[45%]">
          <Camera size={20} color="#3B82F6" />
          <Text className="text-sm text-gray-700 ml-2">Camera an ninh</Text>
        </View>

        <View className="flex-row items-center bg-purple-50 rounded-lg px-3 py-2 flex-1 min-w-[45%]">
          <Wifi size={20} color="#9333EA" />
          <Text className="text-sm text-gray-700 ml-2">WiFi miễn phí</Text>
        </View>

        <View className="flex-row items-center bg-orange-50 rounded-lg px-3 py-2 flex-1 min-w-[45%]">
          <CreditCard size={20} color="#F97316" />
          <Text className="text-sm text-gray-700 ml-2">Thanh toán online</Text>
        </View>
      </View>

      {/* Description */}
      {parkingLot.description && (
        <View className="mt-4 pt-4 border-t border-gray-100">
          <Text className="text-base font-semibold text-gray-900 mb-2">Mô tả</Text>
          <Text className="text-gray-600 leading-6">{parkingLot.description}</Text>
        </View>
      )}

      {/* Zones */}
      <View className="mt-4 pt-4 border-t border-gray-100">
        <Text className="text-base font-semibold text-gray-900 mb-3">Khu vực đỗ xe</Text>
        <View className="flex-row flex-wrap gap-2">
          {parkingLot.zones.map((zone, index) => (
            <View key={index} className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <Text className="text-sm font-semibold text-blue-700">
                Khu {zone.zone}: {zone.count} chỗ
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Payment Methods */}
      <View className="mt-4 pt-4 border-t border-gray-100">
        <Text className="text-base font-semibold text-gray-900 mb-3">Phương thức thanh toán</Text>
        <View className="flex-row flex-wrap gap-2">
          {parkingLot.allowedPaymentMethods.map((method, index) => (
            <View key={index} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Text className="text-sm font-semibold text-gray-700">
                {method === 'prepaid' ? '💳 Trả trước' : '💰 Trả tại bãi'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
