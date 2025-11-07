import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Bell, Gift, AlertCircle, Info, Trash2, CheckCheck } from 'lucide-react-native';

interface Notification {
  id: string;
  type: 'promotion' | 'booking' | 'system' | 'warning';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'promotion',
      title: '🎉 Khuyến mãi 20% hôm nay!',
      message: 'Giảm giá 20% cho tất cả bãi xe trong hệ thống. Nhanh tay đặt chỗ ngay!',
      date: '2 giờ trước',
      isRead: false,
    },
    {
      id: '2',
      type: 'booking',
      title: 'Đặt chỗ thành công',
      message: 'Bạn đã đặt chỗ tại Bãi An Phú Plaza lúc 14:30. Mã đặt chỗ: #BP12345',
      date: '5 giờ trước',
      isRead: false,
    },
    {
      id: '3',
      type: 'system',
      title: 'Hoạt động bảo trì hệ thống',
      message: 'Hệ thống sẽ bảo trì từ 02:00 - 04:00 ngày 25/12. Vui lòng hoàn tất giao dịch trước thời gian này.',
      date: '1 ngày trước',
      isRead: true,
    },
    {
      id: '4',
      type: 'warning',
      title: '⚠️ Cảnh báo hết thời gian đỗ',
      message: 'Thời gian đỗ xe của bạn tại Bãi Vincom sắp hết. Vui lòng gia hạn hoặc lấy xe.',
      date: '2 ngày trước',
      isRead: true,
    },
    {
      id: '5',
      type: 'promotion',
      title: '💎 Ưu đãi thành viên VIP',
      message: 'Nâng cấp lên tài khoản VIP để nhận ưu đãi độc quyền và tích điểm x2!',
      date: '3 ngày trước',
      isRead: true,
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'promotion':
        return <Gift size={20} color="#22C55E" />;
      case 'booking':
        return <Bell size={20} color="#3B82F6" />;
      case 'system':
        return <Info size={20} color="#9CA3AF" />;
      case 'warning':
        return <AlertCircle size={20} color="#F59E0B" />;
      default:
        return <Bell size={20} color="#9CA3AF" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'promotion':
        return 'bg-green-50';
      case 'booking':
        return 'bg-blue-50';
      case 'system':
        return 'bg-gray-50';
      case 'warning':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleMarkAsRead(item.id)}
      className={`bg-white rounded-2xl p-4 mb-3 ${!item.isRead ? 'border-2 border-green-500' : ''}`}
      style={{ 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 3,
        elevation: 2 
      }}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        <View className={`w-12 h-12 rounded-xl ${getBgColor(item.type)} items-center justify-center mr-3`}>
          {getIcon(item.type)}
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-gray-900 font-bold text-base flex-1 pr-2">
              {item.title}
            </Text>
            {!item.isRead && (
              <View className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5" />
            )}
          </View>

          <Text className="text-gray-600 text-sm mb-2 leading-5">
            {item.message}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-xs">{item.date}</Text>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              className="p-1"
            >
              <Trash2 size={14} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View className="items-center justify-center py-12 px-6">
      <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Bell size={48} color="#9CA3AF" />
      </View>
      <Text className="text-gray-900 font-semibold text-lg mb-2">
        Không có thông báo
      </Text>
      <Text className="text-gray-500 text-center">
        Bạn sẽ nhận được thông báo về đặt chỗ, khuyến mãi và cập nhật hệ thống tại đây
      </Text>
    </View>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Thông báo',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () =>
            unreadCount > 0 ? (
              <TouchableOpacity onPress={handleMarkAllAsRead} className="ml-4 p-2">
                <CheckCheck size={20} color="#22C55E" />
              </TouchableOpacity>
            ) : null,
        }}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22C55E']} />
        }
        ListHeaderComponent={
          notifications.length > 0 ? (
            <View className="px-4 pt-4 pb-2">
              {unreadCount > 0 && (
                <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-green-900 font-semibold mb-1">
                        {unreadCount} thông báo chưa đọc
                      </Text>
                      <Text className="text-green-700 text-sm">
                        Nhấn vào thông báo để đánh dấu đã đọc
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleMarkAllAsRead}
                      className="bg-green-500 px-4 py-2 rounded-xl ml-3"
                    >
                      <Text className="text-white font-semibold text-sm">Đọc tất cả</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
