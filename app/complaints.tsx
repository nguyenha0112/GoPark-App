import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, MessageSquare, Image as ImageIcon, FileText, Send } from 'lucide-react-native';

interface Category {
  id: string;
  label: string;
  icon: string;
}

export default function ComplaintsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories: Category[] = [
    { id: '1', label: 'Dịch vụ không tốt', icon: '⚠️' },
    { id: '2', label: 'Vấn đề về thanh toán', icon: '💳' },
    { id: '3', label: 'Bãi xe không đúng mô tả', icon: '🅿️' },
    { id: '4', label: 'An ninh kém', icon: '🔒' },
    { id: '5', label: 'Ứng dụng có lỗi', icon: '🐛' },
    { id: '6', label: 'Khác', icon: '💬' },
  ];

  const handleSubmit = async () => {
    if (!selectedCategory) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn danh mục');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tiêu đề');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng mô tả chi tiết vấn đề');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);

    Alert.alert(
      'Gửi khiếu nại thành công',
      'Chúng tôi đã nhận được khiếu nại của bạn và sẽ xử lý trong thời gian sớm nhất.',
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedCategory('');
            setSubject('');
            setDescription('');
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Khiếu nại & Phản hồi',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-4">
          {/* Info Banner */}
          <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <MessageSquare size={20} color="#3B82F6" />
              <Text className="text-blue-900 font-semibold ml-2">Hỗ trợ khách hàng</Text>
            </View>
            <Text className="text-blue-700 text-sm">
              Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn. Mọi khiếu nại sẽ được xử lý trong vòng 24-48 giờ.
            </Text>
          </View>

          {/* Category Selection */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold text-base mb-3">
              Chọn danh mục <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  className={`px-4 py-3 rounded-xl border-2 ${
                    selectedCategory === category.id
                      ? 'bg-green-50 border-green-500'
                      : 'bg-white border-gray-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <Text className="text-base mr-2">{category.icon}</Text>
                    <Text 
                      className={`font-semibold text-sm ${
                        selectedCategory === category.id
                          ? 'text-green-700'
                          : 'text-gray-700'
                      }`}
                    >
                      {category.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Subject Input */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold text-base mb-2">
              Tiêu đề <Text className="text-red-500">*</Text>
            </Text>
            <View 
              className="bg-white rounded-xl border-2 border-gray-200 focus:border-green-500"
              style={{ 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 1 }, 
                shadowOpacity: 0.05, 
                shadowRadius: 2,
                elevation: 1 
              }}
            >
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="Nhập tiêu đề khiếu nại..."
                className="px-4 py-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
                maxLength={100}
              />
            </View>
            <Text className="text-gray-500 text-xs mt-1 text-right">
              {subject.length}/100
            </Text>
          </View>

          {/* Description Input */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold text-base mb-2">
              Mô tả chi tiết <Text className="text-red-500">*</Text>
            </Text>
            <View 
              className="bg-white rounded-xl border-2 border-gray-200"
              style={{ 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 1 }, 
                shadowOpacity: 0.05, 
                shadowRadius: 2,
                elevation: 1 
              }}
            >
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                className="px-4 py-3 text-gray-900 min-h-[150px]"
                placeholderTextColor="#9CA3AF"
                maxLength={500}
              />
            </View>
            <Text className="text-gray-500 text-xs mt-1 text-right">
              {description.length}/500
            </Text>
          </View>

          {/* Attachment Options (Placeholder) */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold text-base mb-3">
              Đính kèm (Tùy chọn)
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-4 items-center active:bg-gray-50"
                onPress={() => Alert.alert('Thông báo', 'Chức năng đang phát triển')}
              >
                <ImageIcon size={24} color="#9CA3AF" />
                <Text className="text-gray-700 text-sm mt-2 font-medium">Hình ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-4 items-center active:bg-gray-50"
                onPress={() => Alert.alert('Thông báo', 'Chức năng đang phát triển')}
              >
                <FileText size={24} color="#9CA3AF" />
                <Text className="text-gray-700 text-sm mt-2 font-medium">Tài liệu</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            className={`py-4 rounded-2xl flex-row items-center justify-center ${
              submitting ? 'bg-gray-300' : 'bg-green-500 active:bg-green-600'
            }`}
            style={!submitting ? { 
              shadowColor: '#22C55E', 
              shadowOffset: { width: 0, height: 4 }, 
              shadowOpacity: 0.3, 
              shadowRadius: 8,
              elevation: 6 
            } : {}}
          >
            {submitting ? (
              <Text className="text-white font-bold text-base">Đang gửi...</Text>
            ) : (
              <>
                <Send size={20} color="#FFF" />
                <Text className="text-white font-bold text-base ml-2">Gửi khiếu nại</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Help Text */}
          <View className="bg-gray-100 rounded-xl p-4 mt-4">
            <Text className="text-gray-700 text-sm mb-2 font-semibold">
              📞 Cần hỗ trợ khẩn cấp?
            </Text>
            <Text className="text-gray-600 text-sm">
              Hotline: <Text className="text-green-600 font-semibold">1900-xxxx</Text>
            </Text>
            <Text className="text-gray-600 text-sm">
              Email: <Text className="text-green-600 font-semibold">support@gopark.vn</Text>
            </Text>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
