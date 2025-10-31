import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, ArrowRight } from 'lucide-react-native';

interface BookingCTAProps {
  parkingLotId: string;
  parkingLotName: string;
}

export default function BookingCTA({ parkingLotId, parkingLotName }: BookingCTAProps) {
  const router = useRouter();

  const handleBooking = () => {
    // Navigate để tới bước đặt chỗ với thông tin bãi đỗ
    router.push({
      pathname: '/booking/step1',
      params: {
        parkingLotId,
        parkingLotName,
      },
    } as any);
  };

  return (
    <View className="bg-white border-t border-gray-200 p-4">
      <TouchableOpacity
        onPress={handleBooking}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl py-4 px-6 flex-row items-center justify-between shadow-lg"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center flex-1">
          <View className="bg-white/20 rounded-full p-2 mr-3">
            <Calendar size={24} color="#FFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">Đặt chỗ ngay</Text>
            <Text className="text-white/80 text-sm">Chỉ mất 2 phút</Text>
          </View>
        </View>
        <View className="bg-white/20 rounded-full p-2">
          <ArrowRight size={24} color="#FFF" />
        </View>
      </TouchableOpacity>

      <Text className="text-center text-gray-500 text-xs mt-3">
        Đảm bảo có chỗ đỗ khi bạn đến
      </Text>
    </View>
  );
}
