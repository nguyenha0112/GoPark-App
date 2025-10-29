import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import SearchBar from '@/components/SearchBar';
import ViewToggle from '@/components/ViewToggle';
import ParkingMapView from '@/components/ParkingMapView';
import ParkingListItem from '@/components/ParkingListItem';
import { BASE_URL } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Mock data cho demo (sau này sẽ fetch từ API)
  const mockParkingLots = [
    {
      id: '1',
      name: 'Bãi đỗ xe Trung tâm',
      address: '123 Lê Duẩn, Hải Châu, Đà Nẵng',
      latitude: 16.0544,
      longitude: 108.2022,
      availableSpots: 25,
      totalSpots: 50,
      pricePerHour: 15000,
      distance: '0.5 km',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Bãi đỗ xe Sông Hàn',
      address: '456 Trần Phú, Hải Châu, Đà Nẵng',
      latitude: 16.0678,
      longitude: 108.2208,
      availableSpots: 8,
      totalSpots: 30,
      pricePerHour: 20000,
      distance: '1.2 km',
      rating: 4.7,
    },
    {
      id: '3',
      name: 'Bãi đỗ xe Vincom',
      address: '910A Ngô Quyền, Sơn Trà, Đà Nẵng',
      latitude: 16.0539,
      longitude: 108.2437,
      availableSpots: 45,
      totalSpots: 100,
      pricePerHour: 18000,
      distance: '2.1 km',
      rating: 4.8,
    },
    {
      id: '4',
      name: 'Bãi đỗ xe Bãi Biển',
      address: 'Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng',
      latitude: 16.0397,
      longitude: 108.2525,
      availableSpots: 3,
      totalSpots: 40,
      pricePerHour: 25000,
      distance: '3.5 km',
      rating: 4.6,
    },
  ];

  // Get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập vị trí',
          'Vui lòng cho phép truy cập vị trí để tìm bãi đỗ xe gần bạn'
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Load parking lots (mock data for now)
  useEffect(() => {
    setParkingLots(mockParkingLots);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập địa điểm cần tìm');
      return;
    }

    setLoading(true);
    try {
      // TODO: Gọi API tìm kiếm
      console.log('Searching for:', searchQuery);
      // const response = await fetch(`${BASE_URL}/api/parking-lots/search?q=${searchQuery}`);
      // const data = await response.json();
      // setParkingLots(data);
      
      // Filter mock data for demo
      const filtered = mockParkingLots.filter(lot =>
        lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setParkingLots(filtered);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm bãi đỗ xe');
    } finally {
      setLoading(false);
    }
  };

  const handleParkingLotPress = (parkingLot) => {
    // TODO: Navigate to parking lot detail page
    Alert.alert(
      parkingLot.name,
      `${parkingLot.address}\n\nChỗ trống: ${parkingLot.availableSpots}/${parkingLot.totalSpots}\nGiá: ${parkingLot.pricePerHour.toLocaleString('vi-VN')}đ/giờ`,
      [
        { text: 'Đóng', style: 'cancel' },
        { text: 'Đặt chỗ', onPress: () => router.push('/(tabs)/booking') }
      ]
    );
  };

  const handleFilterPress = () => {
    Alert.alert('Bộ lọc', 'Chức năng bộ lọc đang được phát triển');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-gradient-to-br from-purple-600 to-pink-600 px-4 pt-4 pb-6 rounded-b-3xl shadow-lg">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Tìm kiếm bãi đỗ xe..."
        />
      </View>

      {/* View Toggle */}
      <View className="px-4 py-3">
        <ViewToggle
          activeView={viewMode}
          onViewChange={setViewMode}
          onFilterPress={handleFilterPress}
        />
      </View>

      {/* Content */}
      <View className="flex-1 px-4">
        {viewMode === 'map' ? (
          <View className="flex-1 mb-4">
            <ParkingMapView
              parkingLots={parkingLots}
              onMarkerPress={handleParkingLotPress}
              userLocation={userLocation}
            />
          </View>
        ) : (
          <FlatList
            data={parkingLots}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ParkingListItem
                parkingLot={item}
                onPress={() => handleParkingLotPress(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-4"
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Text className="text-gray-400 text-base">
                  Không tìm thấy bãi đỗ xe
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Login Prompt for guests */}
      {/* <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600 to-pink-600 px-4 py-4 rounded-t-3xl shadow-lg">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white text-sm mb-1">
              ⭐ Đăng nhập để đặt chỗ và nhận ưu đãi đặc biệt!
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              className="bg-white/20 px-4 py-2 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-sm">Đăng ký</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="bg-white px-4 py-2 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-purple-600 font-bold text-sm">Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View> */}
    </View>
  );
}