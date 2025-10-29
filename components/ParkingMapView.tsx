import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  availableSpots: number;
  totalSpots: number;
  pricePerHour: number;
}

interface ParkingMapViewProps {
  parkingLots: ParkingLot[];
  onMarkerPress: (parkingLot: ParkingLot) => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export default function ParkingMapView({ 
  parkingLots, 
  onMarkerPress,
  userLocation 
}: ParkingMapViewProps) {
  const [region, setRegion] = useState({
    latitude: userLocation?.latitude || 16.0544,  // Đà Nẵng mặc định
    longitude: userLocation?.longitude || 108.2022,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [userLocation]);

  return (
    <View className="flex-1 rounded-2xl overflow-hidden">
      <MapView
        provider={PROVIDER_GOOGLE}
        className="flex-1"
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        loadingEnabled={true}
        loadingIndicatorColor="#3B82F6"
      >
        {parkingLots.map((lot) => (
          <Marker
            key={lot.id}
            coordinate={{
              latitude: lot.latitude,
              longitude: lot.longitude,
            }}
            onPress={() => onMarkerPress(lot)}
            title={lot.name}
            description={`${lot.availableSpots}/${lot.totalSpots} chỗ trống`}
          >
            <View className="bg-purple-600 rounded-full p-2 shadow-lg">
              <MapPin size={24} color="#FFF" />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
