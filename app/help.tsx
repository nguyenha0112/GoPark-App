import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
} from 'lucide-react-native';

export default function HelpPage() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const faqs = [
    {
      question: 'Làm thế nào để đặt chỗ đỗ xe?',
      answer:
        'Bạn có thể tìm kiếm bãi đỗ xe trên trang chủ, xem thông tin chi tiết và nhấn "Đặt chỗ ngay". Sau đó chọn thời gian và phương tiện, rồi xác nhận đặt chỗ.',
    },
    {
      question: 'Tôi có thể hủy đặt chỗ không?',
      answer:
        'Có, bạn có thể hủy đặt chỗ trong mục "Lịch sử đặt chỗ". Tuy nhiên, nếu đã thanh toán trước, phí hủy có thể được áp dụng tùy theo chính sách của từng bãi đỗ.',
    },
    {
      question: 'Các phương thức thanh toán nào được hỗ trợ?',
      answer:
        'GoPark hỗ trợ thanh toán online (qua ví điện tử, thẻ ngân hàng) và thanh toán tại bãi (tiền mặt). Bạn có thể chọn phương thức phù hợp khi đặt chỗ.',
    },
    {
      question: 'Làm sao để thêm phương tiện?',
      answer:
        'Vào menu > "Xe của tôi" > nhấn nút "+" để thêm thông tin phương tiện (biển số, loại xe, màu sắc...). Thông tin này sẽ được sử dụng khi đặt chỗ.',
    },
    {
      question: 'Tôi quên mật khẩu, phải làm sao?',
      answer:
        'Tại màn hình đăng nhập, nhấn "Quên mật khẩu?". Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.',
    },
    {
      question: 'Ứng dụng có tính phí không?',
      answer:
        'Ứng dụng GoPark hoàn toàn miễn phí. Bạn chỉ trả phí cho chỗ đỗ xe mà bạn sử dụng theo giá niêm yết của từng bãi đỗ.',
    },
  ];

  const handleCall = () => {
    Linking.openURL('tel:1900xxxx');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@gopark.vn');
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung tin nhắn');
      return;
    }
    Alert.alert('Thành công', 'Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất!');
    setMessage('');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Trợ giúp & Hỗ trợ',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        {/* Contact Section */}
        <View className="bg-white m-4 rounded-xl shadow-sm p-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</Text>
          
          <TouchableOpacity
            onPress={handleCall}
            className="flex-row items-center bg-green-50 p-4 rounded-lg mb-3 border border-green-200"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mr-3">
              <Phone size={20} color="#FFF" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm">Hotline</Text>
              <Text className="text-gray-900 font-semibold text-base">1900 xxxx</Text>
            </View>
            <Text className="text-green-600 font-semibold">Gọi ngay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEmail}
            className="flex-row items-center bg-blue-50 p-4 rounded-lg border border-blue-200"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
              <Mail size={20} color="#FFF" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm">Email</Text>
              <Text className="text-gray-900 font-semibold text-base">support@gopark.vn</Text>
            </View>
            <Text className="text-blue-600 font-semibold">Gửi mail</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <View className="bg-white mx-4 mb-4 rounded-xl shadow-sm p-4">
          <View className="flex-row items-center mb-4">
            <HelpCircle size={24} color="#22c55e" />
            <Text className="text-lg font-bold text-gray-900 ml-2">Câu hỏi thường gặp</Text>
          </View>

          {faqs.map((faq, index) => (
            <View key={index} className="mb-2">
              <TouchableOpacity
                onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className={`flex-row items-center justify-between p-3 bg-gray-50 rounded-lg ${
                  expandedFaq === index ? 'rounded-b-none' : ''
                }`}
                activeOpacity={0.7}
              >
                <Text className="text-gray-900 font-medium flex-1 mr-2">{faq.question}</Text>
                {expandedFaq === index ? (
                  <ChevronUp size={20} color="#6B7280" />
                ) : (
                  <ChevronDown size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
              {expandedFaq === index && (
                <View className="bg-gray-50 px-3 pb-3 rounded-b-lg">
                  <Text className="text-gray-600 leading-6">{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Send Message */}
        <View className="bg-white mx-4 mb-4 rounded-xl shadow-sm p-4">
          <View className="flex-row items-center mb-4">
            <MessageCircle size={24} color="#22c55e" />
            <Text className="text-lg font-bold text-gray-900 ml-2">Gửi tin nhắn cho chúng tôi</Text>
          </View>

          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Nhập câu hỏi hoặc phản hồi của bạn..."
            multiline
            numberOfLines={4}
            className="bg-gray-50 p-3 rounded-lg text-gray-900 mb-3"
            textAlignVertical="top"
          />

          <TouchableOpacity
            onPress={handleSendMessage}
            className="bg-green-500 py-3 rounded-lg flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Send size={18} color="#FFF" />
            <Text className="text-white font-semibold ml-2">Gửi tin nhắn</Text>
          </TouchableOpacity>
        </View>

        {/* Working Hours */}
        <View className="bg-white mx-4 mb-4 rounded-xl shadow-sm p-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">Thời gian hỗ trợ</Text>
          <View className="flex-row items-center mb-2">
            <Text className="text-gray-600 flex-1">Thứ 2 - Thứ 6:</Text>
            <Text className="text-gray-900 font-semibold">8:00 - 18:00</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Text className="text-gray-600 flex-1">Thứ 7 - Chủ nhật:</Text>
            <Text className="text-gray-900 font-semibold">9:00 - 17:00</Text>
          </View>
          <Text className="text-gray-500 text-xs mt-2">
            * Hotline và email hỗ trợ 24/7 trong trường hợp khẩn cấp
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
