import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Star, MapPin, Clock, ThumbsUp, MessageSquare } from 'lucide-react-native';

interface Review {
  id: string;
  parkingLotName: string;
  parkingLotAddress: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  replies: number;
  image?: string;
}

export default function MyReviewsPage() {
  const router = useRouter();

  const reviews: Review[] = [
    {
      id: '1',
      parkingLotName: 'Bãi đỗ xe An Phú Plaza',
      parkingLotAddress: '117-119 Lý Chính Thắng, Q.3',
      rating: 5,
      comment: 'Bãi xe rộng rãi, sạch sẽ. Nhân viên thân thiện, giá cả hợp lý. Rất đáng để quay lại!',
      date: '20/12/2024',
      helpful: 12,
      replies: 2,
    },
    {
      id: '2',
      parkingLotName: 'Bãi Vincom Center',
      parkingLotAddress: '72 Lê Thánh Tôn, Q.1',
      rating: 4,
      comment: 'Vị trí thuận tiện, an ninh tốt. Giá hơi cao một chút nhưng xứng đáng.',
      date: '15/12/2024',
      helpful: 8,
      replies: 1,
    },
    {
      id: '3',
      parkingLotName: 'Bãi Landmark 81',
      parkingLotAddress: '720A Điện Biên Phủ, Bình Thạnh',
      rating: 5,
      comment: 'Bãi xe hiện đại, có camera an ninh khắp nơi. Rất yên tâm khi để xe ở đây!',
      date: '10/12/2024',
      helpful: 15,
      replies: 0,
    },
    {
      id: '4',
      parkingLotName: 'Bãi Saigon Center',
      parkingLotAddress: '65 Lê Lợi, Q.1',
      rating: 3,
      comment: 'Bãi xe hơi chật trong giờ cao điểm, nhân viên cần nhiệt tình hơn.',
      date: '05/12/2024',
      helpful: 5,
      replies: 1,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            color={star <= rating ? '#FBBF24' : '#E5E7EB'}
            fill={star <= rating ? '#FBBF24' : 'none'}
          />
        ))}
      </View>
    );
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View 
      className="bg-white rounded-2xl p-4 mb-3"
      style={{ 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 3,
        elevation: 2 
      }}
    >
      {/* Header */}
      <View className="flex-row items-start mb-3">
        <View className="w-12 h-12 rounded-xl bg-green-50 items-center justify-center mr-3">
          <Text className="text-xl">🅿️</Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-bold text-base mb-1">
            {item.parkingLotName}
          </Text>
          <View className="flex-row items-center mb-1">
            <MapPin size={12} color="#9CA3AF" />
            <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>
              {item.parkingLotAddress}
            </Text>
          </View>
          <View className="flex-row items-center">
            {renderStars(item.rating)}
            <Text className="text-gray-600 text-sm font-semibold ml-2">
              {item.rating}.0
            </Text>
          </View>
        </View>
      </View>

      {/* Comment */}
      <View className="bg-gray-50 rounded-xl p-3 mb-3">
        <Text className="text-gray-800 text-sm leading-5">
          {item.comment}
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
        <View className="flex-row items-center">
          <Clock size={12} color="#9CA3AF" />
          <Text className="text-gray-500 text-xs ml-1">{item.date}</Text>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-row items-center">
            <ThumbsUp size={14} color="#22C55E" />
            <Text className="text-gray-600 text-xs font-semibold ml-1">
              {item.helpful}
            </Text>
          </View>
          {item.replies > 0 && (
            <View className="flex-row items-center">
              <MessageSquare size={14} color="#3B82F6" />
              <Text className="text-gray-600 text-xs font-semibold ml-1">
                {item.replies}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View className="items-center justify-center py-12 px-6">
      <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Star size={48} color="#9CA3AF" />
      </View>
      <Text className="text-gray-900 font-semibold text-lg mb-2">
        Chưa có đánh giá
      </Text>
      <Text className="text-gray-500 text-center">
        Sau khi sử dụng dịch vụ, hãy để lại đánh giá để giúp người khác!
      </Text>
    </View>
  );

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Đánh giá của tôi',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReview}
        ListEmptyComponent={EmptyState}
        ListHeaderComponent={
          reviews.length > 0 ? (
            <View className="p-4">
              {/* Stats Card */}
              <View 
                className="bg-white rounded-2xl p-6 mb-4"
                style={{ 
                  shadowColor: '#000', 
                  shadowOffset: { width: 0, height: 2 }, 
                  shadowOpacity: 0.1, 
                  shadowRadius: 4,
                  elevation: 3 
                }}
              >
                <View className="items-center mb-4">
                  <Text className="text-5xl font-bold text-gray-900 mb-1">
                    {averageRating}
                  </Text>
                  <View className="flex-row mb-1">
                    {renderStars(Math.round(parseFloat(averageRating)))}
                  </View>
                  <Text className="text-gray-500 text-sm">
                    {reviews.length} đánh giá
                  </Text>
                </View>

                {/* Rating Distribution */}
                <View className="gap-2">
                  {ratingCounts.map(({ star, count }) => {
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <View key={star} className="flex-row items-center">
                        <Text className="text-gray-700 text-xs w-8">{star} ⭐</Text>
                        <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mx-2">
                          <View 
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </View>
                        <Text className="text-gray-600 text-xs w-6 text-right">{count}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <Text className="text-gray-900 text-lg font-bold mb-3">
                Tất cả đánh giá ({reviews.length})
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
