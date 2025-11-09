import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Shield,
  Globe,
  Moon,
  ChevronRight,
  Info,
  FileText,
  LucideIcon,
} from 'lucide-react-native';

interface SettingItem {
  icon: LucideIcon;
  label: string;
  type: 'toggle' | 'select' | 'link' | 'info';
  value?: boolean | string;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  subtitle?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Thông báo',
      items: [
        {
          icon: Bell,
          label: 'Thông báo đẩy',
          value: notifications,
          onToggle: setNotifications,
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Giao diện',
      items: [
        {
          icon: Moon,
          label: 'Chế độ tối',
          value: darkMode,
          onToggle: setDarkMode,
          type: 'toggle',
          subtitle: 'Đang phát triển',
        },
        {
          icon: Globe,
          label: 'Ngôn ngữ',
          value: 'Tiếng Việt',
          onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển'),
          type: 'select',
        },
      ],
    },
    {
      title: 'Quyền riêng tư & Bảo mật',
      items: [
        {
          icon: Shield,
          label: 'Dịch vụ vị trí',
          value: locationServices,
          onToggle: setLocationServices,
          type: 'toggle',
        },
        {
          icon: Shield,
          label: 'Đổi mật khẩu',
          onPress: () => router.push('/change-password'),
          type: 'link',
        },
      ],
    },
    {
      title: 'Về ứng dụng',
      items: [
        {
          icon: Info,
          label: 'Thông tin ứng dụng',
          value: 'v1.0.0',
          type: 'info',
        },
        {
          icon: FileText,
          label: 'Điều khoản sử dụng',
          onPress: () => router.push('/help'),
          type: 'link',
        },
        {
          icon: FileText,
          label: 'Chính sách bảo mật',
          onPress: () => router.push('/help'),
          type: 'link',
        },
      ],
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Cài đặt',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mt-4">
            <Text className="text-gray-600 font-semibold text-sm px-4 mb-2">
              {section.title}
            </Text>
            <View className="bg-white">
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    onPress={item.onPress}
                    disabled={item.type === 'toggle' || item.type === 'info'}
                    className={`flex-row items-center justify-between px-4 py-4 ${
                      itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                    activeOpacity={item.type === 'link' ? 0.7 : 1}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                        <IconComponent size={20} color="#6B7280" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 font-medium">{item.label}</Text>
                        {item.subtitle && (
                          <Text className="text-gray-500 text-xs mt-1">{item.subtitle}</Text>
                        )}
                      </View>
                    </View>
                    
                    {item.type === 'toggle' && (
                      <Switch
                        value={item.value as boolean}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                        thumbColor={item.value ? '#22c55e' : '#F3F4F6'}
                      />
                    )}
                    
                    {item.type === 'select' && (
                      <View className="flex-row items-center">
                        <Text className="text-gray-500 mr-2">{item.value as string}</Text>
                        <ChevronRight size={20} color="#9CA3AF" />
                      </View>
                    )}
                    
                    {item.type === 'link' && (
                      <ChevronRight size={20} color="#9CA3AF" />
                    )}
                    
                    {item.type === 'info' && (
                      <Text className="text-gray-500">{item.value as string}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* App Info Footer */}
        <View className="items-center py-8">
          <Text className="text-gray-400 text-sm">GoPark - Đặt chỗ đỗ xe thông minh</Text>
          <Text className="text-gray-400 text-xs mt-1">© 2025 GoPark Team</Text>
        </View>
      </ScrollView>
    </>
  );
}
