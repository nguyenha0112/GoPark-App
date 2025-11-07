import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  User,
  Car,
  Wallet,
  Clock,
  CreditCard,
  Star,
  MessageCircle,
  Bell,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  TrendingUp,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_URL } from '@/lib/api';

interface UserProfile {
  _id: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  createdAt?: string;
  profilePicture?: string;
}

export default function ProfileTab() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setProfile(userData);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('loadProfile error', err);
      setProfile(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Text className="text-red-600 text-lg font-semibold mb-4">Không thể tải thông tin</Text>
        <TouchableOpacity onPress={loadProfile} className="bg-green-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stats = {
    bookings: 24,
    completed: 15,
    spent: '1.5M',
  };

  const menuItems = [
    { icon: User, label: 'Thông tin cá nhân', route: '/information', color: '#3B82F6', bg: '#EFF6FF' },
    { icon: Car, label: 'Quản lý phương tiện', route: '/vehicles', color: '#EF4444', bg: '#FEF2F2' },
    { icon: Wallet, label: 'Ví GoPark', route: '/wallet', color: '#10B981', bg: '#F0FDF4' },
    { icon: Clock, label: 'Lịch sử đặt chỗ', route: '/(tabs)/history', color: '#F59E0B', bg: '#FFFBEB' },
    { icon: CreditCard, label: 'Phương thức thanh toán', route: '/payment-methods', color: '#8B5CF6', bg: '#F5F3FF' },
    { icon: Star, label: 'Đánh giá của tôi', route: '/my-reviews', color: '#FBBF24', bg: '#FEFCE8' },
    { icon: MessageCircle, label: 'Khiếu nại', route: '/complaints', color: '#EC4899', bg: '#FDF2F8' },
    { icon: Bell, label: 'Thông báo', route: '/notifications', color: '#06B6D4', bg: '#F0FDFA' },
    { icon: Shield, label: 'Bảo mật', route: '/security', color: '#14B8A6', bg: '#F0FDFA' },
    { icon: Settings, label: 'Cài đặt chung', route: '/settings', color: '#6B7280', bg: '#F9FAFB' },
    { icon: HelpCircle, label: 'Trợ giúp & Hỗ trợ', route: '/help', color: '#F97316', bg: '#FFF7ED' },
  ];

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: async () => {
        await AsyncStorage.multiRemove(['token', 'role', 'userId']);
        router.replace('/(auth)/login' as any);
      } }
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22C55E']} />
        }
      >
        {/* Header with Enhanced Gradient */}
        <LinearGradient
          colors={['#10B981', '#059669', '#047857']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingBottom: 48 }}
        >
          <View className="pt-14 px-5">
            {/* Profile Info Card */}
            <View className="flex-row items-center mb-5">
              {/* Avatar with Badge */}
              <View className="mr-4">
                <View 
                  className="w-28 h-28 rounded-3xl bg-white items-center justify-center"
                  style={{ 
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 6 }, 
                    shadowOpacity: 0.3, 
                    shadowRadius: 12,
                    elevation: 12 
                  }}
                >
                  {profile.profilePicture ? (
                    <Image 
                      source={{ uri: profile.profilePicture }} 
                      className="w-28 h-28 rounded-3xl"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-28 h-28 rounded-3xl bg-gradient-to-br from-green-100 to-green-50 items-center justify-center">
                      <User size={56} color="#10B981" strokeWidth={2} />
                    </View>
                  )}
                </View>
                {/* Verification Badge */}
                <View 
                  className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5"
                  style={{ 
                    shadowColor: '#10B981', 
                    shadowOffset: { width: 0, height: 2 }, 
                    shadowOpacity: 0.4, 
                    shadowRadius: 4,
                    elevation: 6 
                  }}
                >
                  <Award size={16} color="#FFF" />
                </View>
              </View>

              {/* User Info */}
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold mb-1.5" numberOfLines={1}>
                  {profile.userName}
                </Text>
                <View className="bg-white/20 backdrop-blur-lg px-3 py-1.5 rounded-full self-start mb-2">
                  <Text className="text-white text-xs font-bold">
                    {profile.role === 'owner' ? '🏢 CHỦ BÃI ĐỖ XE' : profile.role === 'admin' ? '👑 QUẢN TRỊ VIÊN' : '👤 NGƯỜI DÙNG'}
                  </Text>
                </View>
                <View className="space-y-1">
                  <Text className="text-white/95 text-sm" numberOfLines={1}>
                    📧 {profile.email}
                  </Text>
                  {profile.phoneNumber && (
                    <Text className="text-white/95 text-sm">
                      📱 {profile.phoneNumber}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Enhanced Stats Card */}
            <View 
              className="bg-white rounded-3xl p-6"
              style={{ 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 8 }, 
                shadowOpacity: 0.2, 
                shadowRadius: 16,
                elevation: 15 
              }}
            >
              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-gray-900 font-bold text-lg">
                  📊 Thống kê hoạt động
                </Text>
                <TouchableOpacity className="bg-green-50 px-3 py-1.5 rounded-full">
                  <Text className="text-green-600 text-xs font-bold">XEM CHI TIẾT</Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex-row justify-between">
                <View className="flex-1 items-center px-2">
                  <LinearGradient
                    colors={['#DBEAFE', '#BFDBFE']}
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                  >
                    <Text className="text-4xl">🅿️</Text>
                  </LinearGradient>
                  <Text className="text-2xl font-bold text-blue-600 mb-1">
                    {stats.bookings}
                  </Text>
                  <Text className="text-xs text-gray-600 text-center font-medium">Lượt đặt chỗ</Text>
                </View>
                
                <View className="w-px bg-gray-200 mx-1" />
                
                <View className="flex-1 items-center px-2">
                  <LinearGradient
                    colors={['#D1FAE5', '#A7F3D0']}
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                  >
                    <Text className="text-4xl">✅</Text>
                  </LinearGradient>
                  <Text className="text-2xl font-bold text-green-600 mb-1">
                    {stats.completed}
                  </Text>
                  <Text className="text-xs text-gray-600 text-center font-medium">Hoàn thành</Text>
                </View>
                
                <View className="w-px bg-gray-200 mx-1" />
                
                <View className="flex-1 items-center px-2">
                  <LinearGradient
                    colors={['#E9D5FF', '#D8B4FE']}
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                  >
                    <Text className="text-4xl">💰</Text>
                  </LinearGradient>
                  <Text className="text-2xl font-bold text-purple-600 mb-1">
                    {stats.spent}
                  </Text>
                  <Text className="text-xs text-gray-600 text-center font-medium">Tổng chi tiêu</Text>
                </View>
              </View>

              {/* Progress Indicator */}
              <View className="mt-5 pt-5 border-t border-gray-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-600 text-xs font-medium">Tiến độ tháng này</Text>
                  <View className="flex-row items-center">
                    <TrendingUp size={14} color="#10B981" />
                    <Text className="text-green-600 text-xs font-bold ml-1">+12%</Text>
                  </View>
                </View>
                <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <View className="bg-gradient-to-r from-green-400 to-green-600 h-full" style={{ width: '65%' }} />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Section */}
        <View className="px-4 -mt-6">
          <View 
            className="bg-white rounded-3xl overflow-hidden"
            style={{ 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 4 }, 
              shadowOpacity: 0.12, 
              shadowRadius: 12,
              elevation: 8 
            }}
          >
            {menuItems.map((item, idx) => {
              const IconComp = item.icon;
              const isLast = idx === menuItems.length - 1;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleNavigate(item.route)}
                  className={`flex-row items-center px-5 py-4 ${!isLast ? 'border-b border-gray-50' : ''}`}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                  }}
                >
                  <LinearGradient
                    colors={[item.bg, item.bg]}
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                    style={{
                      shadowColor: item.color,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <IconComp size={22} color={item.color} strokeWidth={2.5} />
                  </LinearGradient>
                  <Text className="flex-1 text-gray-900 font-semibold text-base">
                    {item.label}
                  </Text>
                  <ChevronRight size={20} color="#D1D5DB" />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Logout Button with Gradient */}
          <TouchableOpacity
            onPress={handleLogout}
            className="mt-5 rounded-3xl overflow-hidden"
            activeOpacity={0.8}
            style={{ 
              shadowColor: '#EF4444', 
              shadowOffset: { width: 0, height: 4 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 8,
              elevation: 6 
            }}
          >
            <LinearGradient
              colors={['#FEF2F2', '#FEE2E2']}
              className="flex-row items-center px-5 py-4"
            >
              <View 
                className="w-12 h-12 rounded-2xl bg-red-100 items-center justify-center mr-4"
                style={{
                  shadowColor: '#EF4444',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <LogOut size={22} color="#EF4444" strokeWidth={2.5} />
              </View>
              <Text className="flex-1 text-red-600 font-bold text-base">
                Đăng xuất
              </Text>
              <ChevronRight size={20} color="#EF4444" />
            </LinearGradient>
          </TouchableOpacity>

          {/* App Version with Design */}
          <View className="items-center py-8">
            <View className="bg-white px-6 py-3 rounded-full shadow-sm">
              <Text className="text-gray-400 text-xs font-medium">GoPark App • v1.0.0</Text>
            </View>
            <Text className="text-gray-400 text-xs mt-2">Made with ❤️ in Vietnam</Text>
          </View>
        </View>

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
