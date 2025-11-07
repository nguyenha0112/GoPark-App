import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Clock, DollarSign } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
}

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(200000);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const transactions: Transaction[] = [
    { id: '1', title: 'Đỗ xe - Bãi An Phú', amount: -50000, date: '20/12/2024 14:30', type: 'expense', status: 'completed' },
    { id: '2', title: 'Nạp tiền qua Momo', amount: 200000, date: '18/12/2024 10:15', type: 'income', status: 'completed' },
    { id: '3', title: 'Đỗ xe - Bãi Vincom', amount: -30000, date: '15/12/2024 08:45', type: 'expense', status: 'completed' },
    { id: '4', title: 'Đỗ xe - Bãi Landmark', amount: -45000, date: '12/12/2024 16:20', type: 'expense', status: 'completed' },
    { id: '5', title: 'Hoàn tiền - Hủy đặt chỗ', amount: 30000, date: '10/12/2024 09:00', type: 'income', status: 'completed' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleTopUp = () => {
    Alert.alert(
      'Nạp tiền vào ví',
      'Chọn phương thức nạp tiền',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: '💳 Thẻ ngân hàng', onPress: () => console.log('Bank card') },
        { text: '🟣 Momo', onPress: () => console.log('Momo') },
        { text: '💙 ZaloPay', onPress: () => console.log('ZaloPay') },
      ]
    );
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'income';
    const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
    
    return (
      <TouchableOpacity 
        className="bg-white rounded-2xl p-4 mb-3 flex-row items-center active:bg-gray-50"
        style={{ 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 1 }, 
          shadowOpacity: 0.05, 
          shadowRadius: 3,
          elevation: 2 
        }}
      >
        <View 
          className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${
            isIncome ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <Icon size={20} color={isIncome ? '#22C55E' : '#EF4444'} />
        </View>
        
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base mb-1">{item.title}</Text>
          <View className="flex-row items-center">
            <Clock size={12} color="#9CA3AF" />
            <Text className="text-gray-500 text-xs ml-1">{item.date}</Text>
          </View>
        </View>
        
        <View className="items-end">
          <Text
            className={`font-bold text-lg ${
              isIncome ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isIncome ? '+' : '-'}{Math.abs(item.amount).toLocaleString()}đ
          </Text>
          {item.status === 'pending' && (
            <View className="bg-yellow-50 px-2 py-0.5 rounded-full mt-1">
              <Text className="text-yellow-700 text-xs">Đang xử lý</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View className="items-center justify-center py-12">
      <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
        <DollarSign size={48} color="#9CA3AF" />
      </View>
      <Text className="text-gray-900 font-semibold text-lg mb-2">Chưa có giao dịch</Text>
      <Text className="text-gray-500 text-center px-8">
        Lịch sử giao dịch của bạn sẽ hiển thị tại đây
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Ví của tôi',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22C55E']} />
        }
        ListHeaderComponent={
          <>
            {/* Balance Card with Gradient */}
            <View className="p-4">
              <LinearGradient
                colors={['#22C55E', '#16A34A', '#15803D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-6 rounded-3xl"
                style={{ 
                  shadowColor: '#22C55E', 
                  shadowOffset: { width: 0, height: 4 }, 
                  shadowOpacity: 0.3, 
                  shadowRadius: 8,
                  elevation: 8 
                }}
              >
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-white/80 text-sm font-medium">💰 Số dư khả dụng</Text>
                  <View className="bg-white/20 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">GoPark Wallet</Text>
                  </View>
                </View>
                
                <Text className="text-white text-4xl font-bold mb-2">
                  {balance.toLocaleString()}đ
                </Text>
                
                <View className="flex-row items-center mb-6">
                  <TrendingUp size={14} color="#FFF" />
                  <Text className="text-white/80 text-xs ml-1">+12% so với tháng trước</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleTopUp}
                  className="bg-white py-4 rounded-2xl flex-row items-center justify-center active:opacity-80"
                >
                  <Text className="text-green-600 font-bold text-base mr-2">Nạp tiền</Text>
                  <Text className="text-lg">💳</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Quick Stats */}
            <View className="px-4 mb-4">
              <View className="flex-row gap-3">
                <View className="flex-1 bg-green-50 p-4 rounded-2xl border border-green-100">
                  <View className="flex-row items-center mb-2">
                    <ArrowDownLeft size={16} color="#22C55E" />
                    <Text className="text-green-700 text-xs font-semibold ml-1">THU NHẬP</Text>
                  </View>
                  <Text className="text-green-900 text-xl font-bold">
                    +{totalIncome.toLocaleString()}đ
                  </Text>
                  <Text className="text-green-600 text-xs mt-1">Tháng này</Text>
                </View>

                <View className="flex-1 bg-red-50 p-4 rounded-2xl border border-red-100">
                  <View className="flex-row items-center mb-2">
                    <ArrowUpRight size={16} color="#EF4444" />
                    <Text className="text-red-700 text-xs font-semibold ml-1">CHI TIÊU</Text>
                  </View>
                  <Text className="text-red-900 text-xl font-bold">
                    -{totalExpense.toLocaleString()}đ
                  </Text>
                  <Text className="text-red-600 text-xs mt-1">Tháng này</Text>
                </View>
              </View>
            </View>

            {/* Transaction Header */}
            <View className="px-4 mb-3 flex-row items-center justify-between">
              <Text className="text-gray-900 text-lg font-bold">Lịch sử giao dịch</Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-green-600 text-sm font-semibold mr-1">Lọc</Text>
                <Text className="text-base">🔍</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
