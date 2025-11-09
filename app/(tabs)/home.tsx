import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { SlidersHorizontal } from 'lucide-react-native';
import SearchBar from '@/components/SearchBar';
import ViewToggle from '@/components/ViewToggle';
import ParkingMapView from '@/components/ParkingMapView';
import ParkingListItem from '@/components/ParkingListItem';
import FilterModal, { type Filters } from '@/components/FilterModal';
import { fetchAllParkingLots, calculateDistance, type ParkingLot } from '@/lib/parkingLot.api';

export default function Home() {
  // State
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    city: '',
    minPrice: '',
    maxPrice: '',
    paymentMethod: '',
    sortBy: 'newest',
  });

  // lấy d/c ng dùng
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('⚠️ Location permission denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log('✅ User location:', location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.log('⚠️ Could not get location:', error instanceof Error ? error.message : 'Unknown error');
        // Set default location (Đà Nẵng) nếu không lấy được vị trí
        setUserLocation({
          latitude: 16.0544,
          longitude: 108.2022,
        });
      }
    })();
  }, []);

  // Load parking lots on mount
  useEffect(() => {
    loadParkingLots();
  }, []);

  // Load parking lots
  const loadParkingLots = async () => {
    try {
      setLoading(true);
      const data = await fetchAllParkingLots();
      console.log(`✅ Loaded ${data.length} parking lots`);
      setParkingLots(data);
      setFilteredLots(data);
    } catch (error) {
      console.error('❌ Error loading:', error);
      Alert.alert(
        'Lỗi kết nối',
        'Không thể tải danh sách bãi đỗ xe.',
        [
          { text: 'Đóng', style: 'cancel' },
          { text: 'Thử lại', onPress: loadParkingLots }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadParkingLots();
    setRefreshing(false);
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setFilterModalVisible(false);
  };

  // Filter and sort parking lots
  useEffect(() => {
    let filtered = [...parkingLots];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lot =>
        lot.name.toLowerCase().includes(query) ||
        lot.address.toLowerCase().includes(query) ||
        lot.description?.toLowerCase().includes(query)
      );
    }

    // City filter
    if (filters.city.trim()) {
      filtered = filtered.filter(lot =>
        lot.address.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Price filter
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice);
      filtered = filtered.filter(lot => lot.pricePerHour >= minPrice);
    }
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      filtered = filtered.filter(lot => lot.pricePerHour <= maxPrice);
    }

    // Payment method filter
    if (filters.paymentMethod) {
      filtered = filtered.filter(lot =>
        lot.allowedPaymentMethods.includes(filters.paymentMethod)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case 'distance':
        if (userLocation) {
          filtered.sort((a, b) => {
            const distA = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              a.location.coordinates[1],
              a.location.coordinates[0]
            );
            const distB = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              b.location.coordinates[1],
              b.location.coordinates[0]
            );
            return distA - distB;
          });
        }
        break;
    }

    setFilteredLots(filtered);
  }, [searchQuery, filters, parkingLots, userLocation]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredLots(parkingLots);
      return;
    }
    // đây là hàm trống vì việc lọc đã được thực hiện trong useEffect
  };

  const handleParkingLotPress = (parkingLot: ParkingLot) => {
    // Navigate để đến chi tiết bãi đỗ
    router.push({
      pathname: '/parking/[id]', // trang chi tiết bãi đỗ động theo ID bãi đó
      params: { id: parkingLot._id },
    } as any);
  };

// hiển thị loading
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="text-gray-600 mt-4 text-base">Đang tải bãi đỗ xe...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header: Search Bar */}
      <View className="bg-white px-4 pt-2 pb-3 border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Tìm kiếm bãi đỗ xe..."
        />
      </View>

      {/* Controls Row 1: View Toggle */}
      <View className="bg-white px-4 py-2 border-b border-gray-100">
        <ViewToggle
          activeView={viewMode}
          onViewChange={setViewMode}
        />
      </View>

      {/* Controls Row 2: Filter Button + Results Count */}
      <View className="bg-white px-4 py-2 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-500">
            {filteredLots.length} bãi đỗ xe
          </Text>
          
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            className="flex-row items-center bg-green-50 px-3 py-2 rounded-lg border border-green-200"
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={16} color="#22c55e" />
            <Text className="ml-1.5 text-sm font-medium text-green-700">Bộ lọc</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content: Map or List */}
      {viewMode === 'map' ? (
        <View className="flex-1">
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#22c55e']}
              tintColor="#22c55e"
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <Text className="text-gray-400 text-base mb-2">
                Không tìm thấy bãi đỗ xe
              </Text>
              {searchQuery && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text className="text-green-600 text-sm font-medium">Xóa tìm kiếm</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}