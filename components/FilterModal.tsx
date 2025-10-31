import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, MapPin, CreditCard, SortAsc } from 'lucide-react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  currentFilters: Filters;
}

export interface Filters {
  city: string;
  minPrice: string;
  maxPrice: string;
  paymentMethod: string;
  sortBy: string;
}

export default function FilterModal({ visible, onClose, onApply, currentFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<Filters>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: Filters = {
      city: '',
      minPrice: '',
      maxPrice: '',
      paymentMethod: '',
      sortBy: 'newest',
    };
    setFilters(clearedFilters);
    onApply(clearedFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">Bộ lọc</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-4 py-6">
            {/* City Filter */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <MapPin size={20} color="#000" />
                <Text className="text-gray-900 font-semibold text-base ml-2">Thành phố</Text>
              </View>
              <TextInput
                value={filters.city}
                onChangeText={(text) => setFilters({ ...filters, city: text })}
                placeholder="Nhập tên thành phố..."
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Price Range */}
            <View className="mb-6">
              <Text className="text-gray-900 font-semibold text-base mb-2">Khoảng giá (đ/giờ)</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <TextInput
                    value={filters.minPrice}
                    onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
                    placeholder="Từ"
                    keyboardType="numeric"
                    className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <TextInput
                    value={filters.maxPrice}
                    onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
                    placeholder="Đến"
                    keyboardType="numeric"
                    className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Payment Method */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <CreditCard size={20} color="#000" />
                <Text className="text-gray-900 font-semibold text-base ml-2">Phương thức thanh toán</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, paymentMethod: '' })}
                  className={`px-4 py-2 rounded-lg border ${
                    filters.paymentMethod === '' ? 'bg-black border-black' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={filters.paymentMethod === '' ? 'text-white font-semibold' : 'text-gray-700'}>
                    Tất cả
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, paymentMethod: 'prepaid' })}
                  className={`px-4 py-2 rounded-lg border ${
                    filters.paymentMethod === 'prepaid' ? 'bg-black border-black' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={filters.paymentMethod === 'prepaid' ? 'text-white font-semibold' : 'text-gray-700'}>
                    Trả trước
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, paymentMethod: 'pay-at-parking' })}
                  className={`px-4 py-2 rounded-lg border ${
                    filters.paymentMethod === 'pay-at-parking' ? 'bg-black border-black' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={filters.paymentMethod === 'pay-at-parking' ? 'text-white font-semibold' : 'text-gray-700'}>
                    Trả tại bãi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sort By */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <SortAsc size={20} color="#000" />
                <Text className="text-gray-900 font-semibold text-base ml-2">Sắp xếp theo</Text>
              </View>
              <View className="space-y-2">
                {[
                  { value: 'newest', label: 'Mới nhất' },
                  { value: 'oldest', label: 'Cũ nhất' },
                  { value: 'name-asc', label: 'Tên A-Z' },
                  { value: 'name-desc', label: 'Tên Z-A' },
                  { value: 'price-asc', label: 'Giá thấp đến cao' },
                  { value: 'price-desc', label: 'Giá cao đến thấp' },
                  { value: 'distance', label: 'Gần nhất' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setFilters({ ...filters, sortBy: option.value })}
                    className={`p-3 rounded-lg border ${
                      filters.sortBy === option.value ? 'bg-gray-100 border-gray-400' : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`${filters.sortBy === option.value ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View className="p-4 border-t border-gray-200 flex-row gap-3">
            <TouchableOpacity
              onPress={handleClear}
              className="flex-1 bg-white border border-gray-300 rounded-lg py-3"
            >
              <Text className="text-gray-900 font-semibold text-center">Xóa lọc</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 bg-black rounded-lg py-3"
            >
              <Text className="text-white font-semibold text-center">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
