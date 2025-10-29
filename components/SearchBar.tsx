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
    <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-md">
      <Search size={20} color="#9CA3AF" />
      <TextInput
        className="flex-1 ml-3 text-base text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      <TouchableOpacity
        onPress={onSearch}
        className="bg-blue-600 rounded-full p-2"
        activeOpacity={0.8}
      >
        <ArrowRight size={18} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
