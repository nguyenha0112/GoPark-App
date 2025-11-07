import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, CheckCircle, Trash2, Plus } from 'lucide-react-native';

interface PaymentMethod {
  id: string;
  type: 'card' | 'momo' | 'zalopay' | 'vnpay';
  label: string;
  last4?: string;
  isDefault: boolean;
  icon: string;
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'card', label: 'Thẻ Visa', last4: '4242', isDefault: true, icon: '💳' },
    { id: '2', type: 'momo', label: 'Ví Momo', isDefault: false, icon: '🟣' },
    { id: '3', type: 'zalopay', label: 'ZaloPay', isDefault: false, icon: '💙' },
  ]);

  const handleSetDefault = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    Alert.alert('Thành công', 'Đã đặt làm phương thức mặc định');
  };

  const handleDelete = (id: string) => {
    const method = methods.find(m => m.id === id);
    if (method?.isDefault) {
      Alert.alert('Lỗi', 'Không thể xóa phương thức thanh toán mặc định');
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa phương thức thanh toán này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setMethods(prev => prev.filter(m => m.id !== id));
          },
        },
      ]
    );
  };

  const renderMethod = ({ item }: { item: PaymentMethod }) => (
    <View 
      className="bg-white rounded-2xl p-4 mb-3 border-2"
      style={{ 
        borderColor: item.isDefault ? '#22C55E' : '#F3F4F6',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 3,
        elevation: 2 
      }}
    >
      <View className="flex-row items-center">
        <View className="w-14 h-14 rounded-xl bg-gray-50 items-center justify-center mr-4">
          <Text className="text-3xl">{item.icon}</Text>
        </View>
        
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-gray-900 font-bold text-base mr-2">{item.label}</Text>
            {item.isDefault && (
              <View className="bg-green-50 px-2 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-semibold">Mặc định</Text>
              </View>
            )}
          </View>
          {item.last4 && (
            <Text className="text-gray-500 text-sm">•••• •••• •••• {item.last4}</Text>
          )}
        </View>

        {item.isDefault && (
          <CheckCircle size={24} color="#22C55E" />
        )}
      </View>

      <View className="flex-row mt-4 gap-2">
        {!item.isDefault && (
          <TouchableOpacity
            onPress={() => handleSetDefault(item.id)}
            className="flex-1 bg-green-50 py-3 rounded-xl items-center active:bg-green-100"
          >
            <Text className="text-green-600 font-semibold">Đặt làm mặc định</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          className="bg-red-50 px-4 py-3 rounded-xl items-center active:bg-red-100"
          disabled={item.isDefault}
        >
          <Trash2 size={18} color={item.isDefault ? '#D1D5DB' : '#EF4444'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const AddMethodModal = () => (
    <Modal visible={showAddModal} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-gray-900 text-xl font-bold">Thêm phương thức</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text className="text-gray-500 text-2xl">×</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            <TouchableOpacity 
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex-row items-center active:bg-gray-50"
              onPress={() => {
                setShowAddModal(false);
                Alert.alert('Thêm thẻ', 'Chức năng thêm thẻ ngân hàng');
              }}
            >
              <Text className="text-3xl mr-4">💳</Text>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">Thẻ ngân hàng</Text>
                <Text className="text-gray-500 text-sm">Visa, Mastercard, JCB...</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex-row items-center active:bg-gray-50"
              onPress={() => {
                setShowAddModal(false);
                Alert.alert('Liên kết Momo', 'Chức năng liên kết ví Momo');
              }}
            >
              <Text className="text-3xl mr-4">🟣</Text>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">Ví Momo</Text>
                <Text className="text-gray-500 text-sm">Liên kết tài khoản Momo</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex-row items-center active:bg-gray-50"
              onPress={() => {
                setShowAddModal(false);
                Alert.alert('Liên kết ZaloPay', 'Chức năng liên kết ví ZaloPay');
              }}
            >
              <Text className="text-3xl mr-4">💙</Text>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">ZaloPay</Text>
                <Text className="text-gray-500 text-sm">Liên kết tài khoản ZaloPay</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex-row items-center active:bg-gray-50"
              onPress={() => {
                setShowAddModal(false);
                Alert.alert('Liên kết VNPay', 'Chức năng liên kết ví VNPay');
              }}
            >
              <Text className="text-3xl mr-4">🔵</Text>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">VNPay</Text>
                <Text className="text-gray-500 text-sm">Liên kết tài khoản VNPay</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setShowAddModal(false)}
            className="mt-6 bg-gray-100 py-4 rounded-2xl items-center active:bg-gray-200"
          >
            <Text className="text-gray-700 font-semibold text-base">Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Phương thức thanh toán',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1 p-4">
        {/* Info Banner */}
        <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
          <Text className="text-blue-900 font-semibold mb-1">💡 Thông tin</Text>
          <Text className="text-blue-700 text-sm">
            Quản lý các phương thức thanh toán để đặt chỗ nhanh chóng và an toàn hơn.
          </Text>
        </View>

        <FlatList
          data={methods}
          keyExtractor={(item) => item.id}
          renderItem={renderMethod}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
                <CreditCard size={48} color="#9CA3AF" />
              </View>
              <Text className="text-gray-900 font-semibold text-lg mb-2">
                Chưa có phương thức thanh toán
              </Text>
              <Text className="text-gray-500 text-center px-8">
                Thêm phương thức thanh toán để tiện lợi hơn
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="bg-green-500 py-4 rounded-2xl flex-row items-center justify-center mt-4 active:bg-green-600"
          style={{ 
            shadowColor: '#22C55E', 
            shadowOffset: { width: 0, height: 4 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 8,
            elevation: 6 
          }}
        >
          <Plus size={20} color="#FFF" />
          <Text className="text-white font-bold text-base ml-2">Thêm phương thức mới</Text>
        </TouchableOpacity>
      </View>

      <AddMethodModal />
    </View>
  );
}
