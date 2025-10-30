import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { fetchParkingLotById, getAvailableSlotsByDate } from '@/lib/parkingLot.api';

interface ParkingSlot {
  _id: string;
  slotNumber: string;
  zone: string; // Zone name as string, not object / cần chỉnh sau nha ae
  status: string;
  pricePerHour: number;
  parkingLot: string;
}

export default function BookingStep1() {
  const router = useRouter();
  const { parkingLotId, parkingLotName } = useLocalSearchParams<{
    parkingLotId: string;
    parkingLotName: string;
  }>();

  // Date and time states
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // +2 hours
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Parking lot and slots data
  const [parkingLot, setParkingLot] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<ParkingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch parking lot details
  useEffect(() => {
    const loadParkingLot = async () => {
      try {
        setLoading(true);
        const data = await fetchParkingLotById(parkingLotId);
        setParkingLot(data);
      } catch (error) {
        console.error('Error loading parking lot:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin bãi đỗ xe');
      } finally {
        setLoading(false);
      }
    };

    loadParkingLot();
  }, [parkingLotId]);

  // Fetch available slots when dates change
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!parkingLotId || !startDate || !endDate) return;

      try {
        setLoadingSlots(true);
        const slots = await getAvailableSlotsByDate(
          parkingLotId,
          startDate.toISOString(),
          endDate.toISOString()
        );
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error loading available slots:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách chỗ đỗ khả dụng');
      } finally {
        setLoadingSlots(false);
      }
    };

    // Only load slots if end date is after start date
    if (endDate > startDate) {
      loadAvailableSlots();
    }
  }, [parkingLotId, startDate, endDate]);

  // Date picker handlers
  const onStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      // Auto-adjust end date if it's before start date
      if (endDate <= selectedDate) {
        setEndDate(new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000));
      }
    }
  };

  const onStartTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      // Auto-adjust end date if it's before start date
      if (endDate <= selectedDate) {
        setEndDate(new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000));
      }
    }
  };

  const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (selectedDate > startDate) {
        setEndDate(selectedDate);
      } else {
        Alert.alert('Lỗi', 'Thời gian kết thúc phải sau thời gian bắt đầu');
      }
    }
  };

  const onEndTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (selectedDate > startDate) {
        setEndDate(selectedDate);
      } else {
        Alert.alert('Lỗi', 'Thời gian kết thúc phải sau thời gian bắt đầu');
      }
    }
  };

  // Calculate duration and price
  const getDuration = () => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return diffHours;
  };

  const getEstimatedPrice = () => {
    if (!parkingLot) return 0;
    const duration = getDuration();
    // Use slot's pricePerHour if available, otherwise use parking lot's base price
    const pricePerHour = selectedSlot?.pricePerHour || parkingLot.pricePerHour;
    return Math.round(pricePerHour * duration);
  };

  // Handle next step
  const handleNext = () => {
    if (!selectedSlot) {
      Alert.alert('Thông báo', 'Vui lòng chọn chỗ đỗ');
      return;
    }

    if (endDate <= startDate) {
      Alert.alert('Lỗi', 'Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    // Navigate to step 2 with selected data
    router.push({
      pathname: '/booking/step2',
      params: {
        parkingLotId,
        parkingLotName,
        slotId: selectedSlot._id,
        slotNumber: selectedSlot.slotNumber,
        zoneName: selectedSlot.zone, // Zone is already a string
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        estimatedPrice: getEstimatedPrice().toString(),
      },
    } as any);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-gray-600 mt-4">Đang tải...</Text>
      </View>
    );
  }

  // Group slots by zone
  const slotsByZone = availableSlots.reduce((acc, slot) => {
    const zoneName = slot.zone; // Zone is already a string
    if (!acc[zoneName]) {
      acc[zoneName] = [];
    }
    acc[zoneName].push(slot);
    return acc;
  }, {} as Record<string, ParkingSlot[]>);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-purple-600 to-blue-600 pt-12 pb-6 px-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/20 rounded-full p-2 mr-3"
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white font-bold text-xl">Đặt chỗ - Bước 1/3</Text>
            <Text className="text-white/80 text-sm">Chọn thời gian & chỗ đỗ</Text>
          </View>
        </View>

        {/* Parking lot info */}
        <View className="bg-white/20 rounded-xl p-3 flex-row items-center">
          <MapPin size={20} color="#FFF" />
          <Text className="text-white font-semibold text-base ml-2 flex-1" numberOfLines={1}>
            {parkingLotName || parkingLot?.name}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Date and Time Selection */}
        <View className="bg-white m-4 rounded-2xl p-4 shadow-sm">
          <Text className="font-bold text-lg text-gray-800 mb-4">
            Thời gian đỗ xe
          </Text>

          {/* Start Time */}
          <View className="mb-4">
            <Text className="text-gray-600 font-semibold mb-2">Bắt đầu</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(true)}
                className="flex-1 flex-row items-center bg-gray-50 rounded-xl p-3 border border-gray-200"
              >
                <Calendar size={20} color="#8B5CF6" />
                <Text className="text-gray-700 ml-2">{formatDate(startDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowStartTimePicker(true)}
                className="flex-1 flex-row items-center bg-gray-50 rounded-xl p-3 border border-gray-200"
              >
                <Clock size={20} color="#8B5CF6" />
                <Text className="text-gray-700 ml-2">{formatTime(startDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* End Time */}
          <View>
            <Text className="text-gray-600 font-semibold mb-2">Kết thúc</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                className="flex-1 flex-row items-center bg-gray-50 rounded-xl p-3 border border-gray-200"
              >
                <Calendar size={20} color="#8B5CF6" />
                <Text className="text-gray-700 ml-2">{formatDate(endDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowEndTimePicker(true)}
                className="flex-1 flex-row items-center bg-gray-50 rounded-xl p-3 border border-gray-200"
              >
                <Clock size={20} color="#8B5CF6" />
                <Text className="text-gray-700 ml-2">{formatTime(endDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration display */}
          <View className="mt-4 bg-purple-50 rounded-xl p-3">
            <Text className="text-purple-800 font-semibold">
              Thời gian: {getDuration()} giờ • Ước tính: {getEstimatedPrice().toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>

        {/* Available Slots */}
        <View className="bg-white mx-4 mb-4 rounded-2xl p-4 shadow-sm">
          <Text className="font-bold text-lg text-gray-800 mb-2">
            Chọn chỗ đỗ
          </Text>
          <Text className="text-gray-500 text-sm mb-4">
            {availableSlots.length} chỗ đỗ khả dụng
          </Text>

          {loadingSlots ? (
            <ActivityIndicator size="small" color="#8B5CF6" />
          ) : Object.keys(slotsByZone).length === 0 ? (
            <View className="py-8">
              <Text className="text-center text-gray-500">
                Không có chỗ đỗ khả dụng trong thời gian này
              </Text>
            </View>
          ) : (
            Object.entries(slotsByZone).map(([zoneName, slots]) => (
              <View key={zoneName} className="mb-4">
                <Text className="font-semibold text-gray-700 mb-2">{zoneName}</Text>
                <View className="flex-row flex-wrap">
                  {slots.map((slot) => (
                    <TouchableOpacity
                      key={slot._id}
                      onPress={() => setSelectedSlot(slot)}
                      className={`m-1 px-4 py-3 rounded-xl border-2 ${
                        selectedSlot?._id === slot._id
                          ? 'bg-purple-100 border-purple-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          selectedSlot?._id === slot._id ? 'text-purple-700' : 'text-gray-700'
                        }`}
                      >
                        {slot.slotNumber}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="bg-white border-t border-gray-200 p-4">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedSlot || loadingSlots}
          className={`rounded-2xl py-4 px-6 ${
            selectedSlot && !loadingSlots
              ? 'bg-gradient-to-r from-purple-600 to-blue-600'
              : 'bg-gray-300'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-center text-lg">
            Tiếp tục
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Time Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}
      {showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display="default"
          onChange={onStartTimeChange}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate}
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display="default"
          onChange={onEndTimeChange}
        />
      )}
    </View>
  );
}
