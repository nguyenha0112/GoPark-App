import { BASE_URL } from './api';

export interface ParkingLot {
  _id: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  description: string;
  zones: Array<{
    zone: string;
    count: number;
  }>;
  isActive: boolean;
  pricePerHour: number;
  avtImage: string;
  image: string[];
  allowedPaymentMethods: string[];
  parkingOwner?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: string;
  results?: number;
  data: T;
  message?: string;
}

/**
 * Fetch tất cả parking lots (public endpoint)
 */
export const fetchAllParkingLots = async (): Promise<ParkingLot[]> => {
  try {
    const url = `${BASE_URL}/api/v1/parkinglots/public/all`;
    console.log('🔗 Fetching from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || 'Network error'}`);
    }

    const result: ApiResponse<ParkingLot[]> = await response.json();
    console.log('✅ API Response:', result.status, 'Results:', result.results);
    
    if (result.status === 'success') {
      console.log('✅ Parking lots count:', result.data.length);
      return result.data;
    } else {
      throw new Error(result.message || 'Lỗi khi tải dữ liệu bãi đỗ');
    }
  } catch (error) {
    console.error('❌ Error in fetchAllParkingLots:', error);
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      throw new Error('Không thể kết nối với server. Vui lòng kiểm tra:\n1. Backend có đang chạy?\n2. Địa chỉ IP đúng chưa?\n3. Kết nối mạng ổn định không?');
    }
    throw error;
  }
};

/**
 * Fetch bãi theo thành phố
 */
export const fetchParkingLotsByCity = async (city: string): Promise<ParkingLot[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/parkinglots/city/${encodeURIComponent(city)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ParkingLot[]> = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Lỗi khi tải dữ liệu bãi đỗ');
    }
  } catch (error) {
    console.error('Error fetching parking lots by city:', error);
    throw error;
  }
};

/**
 * Fetch bãi theo ID (public endpoint)
 */
export const fetchParkingLotById = async (id: string): Promise<ParkingLot> => {
  try {
    const url = `${BASE_URL}/api/v1/parkinglots/${id}/public`;
    console.log('🔗 Fetching parking lot detail:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || 'Network error'}`);
    }

    const result: ApiResponse<ParkingLot> = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Lỗi khi tải chi tiết bãi đỗ');
    }
  } catch (error) {
    console.error('❌ Error in fetchParkingLotById:', error);
    throw error;
  }
};

/**
 * Fetch slots của bãi đỗ xe theo ID bãi (public endpoint)
 */
export const fetchParkingSlotsByLotId = async (lotId: string): Promise<any[]> => {
  try {
    const url = `${BASE_URL}/api/v1/parkinglots/${lotId}/slots-public`;
    console.log('🔗 Fetching slots:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data?.data || result.data || [];
    } else {
      throw new Error(result.message || 'Lỗi khi tải slots');
    }
  } catch (error) {
    console.error('❌ Error in fetchParkingSlotsByLotId:', error);
    throw error;
  }
};

/**
 * Calculate giữa hai tọa độ sử dụng công thức Haversine
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // bán kính Trái Đất tính bằng km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

/**
 * lấy tổng số chỗ trong bãi đỗ xe
 */
export const getTotalSlots = (zones: Array<{ zone: string; count: number }>): number => {
  return zones.reduce((total, zone) => total + zone.count, 0);
};

/**
 * lấy số chỗ trống (chỗ còn trống) trong bãi đỗ xe (placeholder - sẽ cần dữ liệu thời gian thực)
 */
export const getAvailableSlots = (totalSlots: number): number => {

  return Math.floor(totalSlots * (0.3 + Math.random() * 0.6));
};

/**
 * lấy chỗ trống theo ngày trong bãi đỗ xe
 */
export const getAvailableSlotsByDate = async (
  parkingLotId: string,
  startTime: string,
  endTime: string
): Promise<any[]> => {
  try {
    const url = `${BASE_URL}/api/v1/parking-slots/by-date/${parkingLotId}?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;
    console.log('🔗 Fetching available slots by date:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || 'Network error'}`);
    }

    const result = await response.json();
    console.log('✅ Available slots:', result.status);
    
    if (result.status === 'success') {
      // Backend returns { data: { data: [...] } }
      const slots = result.data?.data || result.data || [];
      // Filter chỉ những chỗ có trạng thái 'available'
      return slots.filter((slot: any) => slot.status === 'available');
    } else {
      throw new Error(result.message || 'Lỗi khi tải slots');
    }
  } catch (error) {
    console.error('❌ Error in getAvailableSlotsByDate:', error);
    throw error;
  }
};
