import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, ArrowRight } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onSearch,
  placeholder = "Tìm kiếm bãi đỗ xe..."
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
      <Search size={20} color="#6B7280" />
      <TextInput
        className="flex-1 ml-3 text-base text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          className="bg-gray-200 rounded-full p-1.5"
          activeOpacity={0.7}
        >
          <ArrowRight size={16} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  );
}
