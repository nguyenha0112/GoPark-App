import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Map, List, Filter } from 'lucide-react-native';

type ViewMode = 'map' | 'list';

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onFilterPress: () => void;
}

export default function ViewToggle({ activeView, onViewChange, onFilterPress }: ViewToggleProps) {
  return (
    <View className="flex-row items-center justify-between bg-white rounded-2xl p-2 shadow-md">
      {/* View Mode Toggles */}
      <View className="flex-row flex-1 bg-gray-100 rounded-xl p-1">
        <TouchableOpacity
          onPress={() => onViewChange('map')}
          className={`flex-1 flex-row items-center justify-center py-2 px-4 rounded-lg ${
            activeView === 'map' ? 'bg-purple-600' : 'bg-transparent'
          }`}
          activeOpacity={0.8}
        >
          <Map 
            size={18} 
            color={activeView === 'map' ? '#FFF' : '#6B7280'} 
          />
          <Text 
            className={`ml-2 font-semibold ${
              activeView === 'map' ? 'text-white' : 'text-gray-500'
            }`}
          >
            Bản đồ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onViewChange('list')}
          className={`flex-1 flex-row items-center justify-center py-2 px-4 rounded-lg ${
            activeView === 'list' ? 'bg-purple-600' : 'bg-transparent'
          }`}
          activeOpacity={0.8}
        >
          <List 
            size={18} 
            color={activeView === 'list' ? '#FFF' : '#6B7280'} 
          />
          <Text 
            className={`ml-2 font-semibold ${
              activeView === 'list' ? 'text-white' : 'text-gray-500'
            }`}
          >
            Danh sách
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        onPress={onFilterPress}
        className="ml-2 bg-purple-600 rounded-xl p-3"
        activeOpacity={0.8}
      >
        <Filter size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
