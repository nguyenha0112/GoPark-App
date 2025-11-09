import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import ParkingDetailHeader from '@/components/detail/ParkingDetailHeader';
import ParkingFeatures from '@/components/detail/ParkingFeatures';
import { fetchParkingLotById, type ParkingLot } from '@/lib/parkingLot.api';

export default function ParkingDetailPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [parkingLot, setParkingLot] = useState<ParkingLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parkingLotId = params.id as string;

  useEffect(() => {
    loadParkingLotDetail();
  }, [parkingLotId]);

  const loadParkingLotDetail = async () => {
    if (!parkingLotId) {
      setError('Không tìm thấy ID bãi đỗ');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchParkingLotById(parkingLotId);
      setParkingLot(data);
    } catch (err: any) {
      console.error('Error loading parking lot:', err);
      setError(err.message || 'Không thể tải thông tin bãi đỗ');
      Alert.alert('Lỗi', err.message || 'Không thể tải thông tin bãi đỗ');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!parkingLot) return;
    
    // Navigate đi tới bước đặt chỗ 1 với thông tin bãi đỗ
    router.push({
      pathname: '/booking/step1',
      params: {
        parkingLotId: parkingLot._id,
        parkingLotName: parkingLot.name,
      },
    } as any);
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 bg-white items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-gray-600 mt-4">Đang tải thông tin...</Text>
        </View>
      </>
    );
  }

  if (error || !parkingLot) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 bg-white items-center justify-center px-6">
          <Text className="text-red-600 text-lg font-semibold mb-4">
            {error || 'Không tìm thấy bãi đỗ xe'}
          </Text>
          <TouchableOpacity
            onPress={loadParkingLotDetail}
            className="bg-green-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Thử lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-3"
          >
            <Text className="text-green-600">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: parkingLot.name,
          headerTitleStyle: {
            fontSize: 16,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2"
            >
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 bg-gray-50">
        <ScrollView showsVerticalScrollIndicator={false}>
          <ParkingDetailHeader parkingLot={parkingLot} />
          <ParkingFeatures parkingLot={parkingLot} />
          
          {/* Spacer for bottom button */}
          <View className="h-24" />
        </ScrollView>

        {/* Fixed Bottom CTA */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <TouchableOpacity
            onPress={handleBooking}
            className="bg-black rounded-xl py-4 px-6 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">Đặt chỗ ngay</Text>
          </TouchableOpacity>
          <Text className="text-center text-gray-500 text-xs mt-2">
            Đảm bảo có chỗ đỗ khi bạn đến
          </Text>
        </View>
      </View>
    </>
  );
}
