import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import SearchBar from '@/components/SearchBar';
import ViewToggle from '@/components/ViewToggle';
import ParkingMapView from '@/components/ParkingMapView';
import ParkingListItem from '@/components/ParkingListItem';
import { fetchAllParkingLots, calculateDistance, type ParkingLot } from '@/lib/parkingLot.api';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  // Load parking lots from API
  useEffect(() => {
    loadParkingLots();
  }, []);

  const loadParkingLots = async () => {
    try {
      setLoading(true);
      const data = await fetchAllParkingLots();
      console.log(`✅ Loaded ${data.length} parking lots from API`);
      setParkingLots(data);
      setFilteredLots(data);
    } catch (error) {
      console.error('❌ Error loading parking lots:', error);
      Alert.alert(
        'Lỗi kết nối',
        'Không thể tải danh sách bãi đỗ xe. Vui lòng kiểm tra kết nối mạng và thử lại.',
        [
          { text: 'Đóng', style: 'cancel' },
          { text: 'Thử lại', onPress: loadParkingLots }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter parking lots when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLots(parkingLots);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = parkingLots.filter(lot =>
      lot.name.toLowerCase().includes(query) ||
      lot.address.toLowerCase().includes(query) ||
      lot.description?.toLowerCase().includes(query)
    );
    setFilteredLots(filtered);
  }, [searchQuery, parkingLots]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredLots(parkingLots);
      return;
    }
    // Filter is already applied in useEffect
  };

  const handleParkingLotPress = (parkingLot: ParkingLot) => {
    // Navigate to parking detail page
    router.push({
      pathname: '/parking/[id]',
      params: { id: parkingLot._id },
    } as any);
  };

  const handleFilterPress = () => {
    Alert.alert('Bộ lọc', 'Chức năng bộ lọc đang được phát triển');
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#9333EA" />
        <Text className="text-gray-600 mt-4 text-base">Đang tải bãi đỗ xe...</Text>
      </View>
    );
  }

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

      {/* Results Count */}
      <View className="px-4 pb-2">
        <Text className="text-gray-600 text-sm">
          Tìm thấy {filteredLots.length} bãi đỗ phù hợp
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-4">
        {viewMode === 'map' ? (
          <View className="flex-1 mb-4">
            <ParkingMapView
              parkingLots={filteredLots}
              onMarkerPress={handleParkingLotPress}
              userLocation={userLocation || undefined}
            />
          </View>
        ) : (
          <FlatList
            data={filteredLots}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const distance = userLocation
                ? calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    item.location.coordinates[1],
                    item.location.coordinates[0]
                  )
                : undefined;

              return (
                <ParkingListItem
                  parkingLot={item}
                  onPress={() => handleParkingLotPress(item)}
                  distance={distance}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-4"
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Text className="text-gray-400 text-base mb-2">
                  Không tìm thấy bãi đỗ xe
                </Text>
                {searchQuery && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text className="text-blue-600 text-sm">Xóa tìm kiếm</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}