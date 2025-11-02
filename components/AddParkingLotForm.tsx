import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createParkingLot } from "../lib/parkingLot.api";

interface Props {
  onSuccess: () => void;
}

export const AddParkingLotForm: React.FC<Props> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [totalSlots, setTotalSlots] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !address || !city || !totalSlots) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ các trường!");
      return;
    }

    try {
      setLoading(true);
      await createParkingLot({
        name,
        address,
        city,
        totalSlots: Number(totalSlots),
      });
      Alert.alert("🎉 Thành công", "Đã tạo bãi đỗ mới!");
      onSuccess();
    } catch (error: any) {
      Alert.alert("❌ Lỗi", error.message || "Không thể tạo bãi đỗ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#2563eb", "#1e40af"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header */}
          <View className="px-6 pt-14 pb-8">
            <Text className="text-3xl font-bold text-white">
              Thêm bãi đỗ mới
            </Text>
            <Text className="text-blue-100 mt-2">
              Nhập thông tin chi tiết cho bãi đỗ của bạn
            </Text>
          </View>

          {/* Form container */}
          <View className="flex-1 bg-gray-50 rounded-t-3xl px-6 pt-8 pb-10 -mt-6">
            <View className="bg-white p-6 rounded-3xl shadow-lg">
              {[
                {
                  label: "Tên bãi đỗ",
                  value: name,
                  set: setName,
                  placeholder: "Ví dụ: Bãi A1 Nguyễn Trãi",
                },
                {
                  label: "Địa chỉ",
                  value: address,
                  set: setAddress,
                  placeholder: "Số 123 Nguyễn Trãi, Q.5",
                },
                {
                  label: "Thành phố",
                  value: city,
                  set: setCity,
                  placeholder: "TP. Hồ Chí Minh",
                },
              ].map((field, index) => (
                <View key={index} className="mb-5">
                  <Text className="text-gray-700 mb-2 font-semibold">
                    {field.label}
                  </Text>
                  <TextInput
                    placeholder={field.placeholder}
                    value={field.value}
                    onChangeText={field.set}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              ))}

              {/* Tổng số chỗ */}
              <View className="mb-7">
                <Text className="text-gray-700 mb-2 font-semibold">
                  Tổng số chỗ
                </Text>
                <TextInput
                  placeholder="Ví dụ: 50"
                  value={totalSlots}
                  onChangeText={setTotalSlots}
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Nút tạo */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
                className={`${
                  loading ? "bg-gray-400" : "bg-blue-600"
                } rounded-xl py-4 flex-row items-center justify-center shadow-md`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color="white"
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-white text-lg font-semibold">
                      Tạo bãi đỗ
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
