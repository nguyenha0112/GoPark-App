import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getMyParkingLots, updateParkingLot } from "../lib/parkingLot.api";

interface EditParkingLotFormProps {
  id: string;
  onSuccess: () => void;
}

function EditParkingLotForm({ id, onSuccess }: EditParkingLotFormProps) {
  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // 🟢 Lấy dữ liệu bãi cần chỉnh sửa
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyParkingLots();
        const found = data.find((p: any) => p._id === id);
        if (!found) {
          Alert.alert("Không tìm thấy bãi đỗ!");
          return;
        }

        const [street = "", district = "", city = ""] = found.address
          ? found.address.split(",").map((s: string) => s.trim())
          : ["", "", ""];

        setLot({
          ...found,
          street,
          district,
          city,
        });

        setAvatar(found.avtImage || null);
        setImages(found.image || []);
      } catch {
        Alert.alert("❌ Lỗi", "Không thể tải thông tin bãi đỗ!");
      }
    };
    fetchData();
  }, [id]);

  // 🖼️ Chọn ảnh
  const pickImage = async (isAvatar = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: !isAvatar,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      if (isAvatar) {
        setAvatar(result.assets[0].uri);
      } else {
        const selected = result.assets.map((a) => a.uri);
        setImages((prev) => [...prev, ...selected]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!lot.name || !lot.street || !lot.city) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ tên, đường và thành phố!"
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: lot.name,
        address: `${lot.street}, ${lot.district}, ${lot.city}`,
        city: lot.city,
        avtImage: avatar,
        image: images,
      };

      await updateParkingLot(id, payload);
      Alert.alert("✅ Thành công", "Đã cập nhật bãi đỗ!");
      onSuccess();
    } catch (error: any) {
      Alert.alert("❌ Lỗi", error.message || "Không thể cập nhật bãi đỗ!");
    } finally {
      setLoading(false);
    }
  };

  if (!lot)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-600">Đang tải dữ liệu...</Text>
      </View>
    );

  return (
    <ScrollView
      className="flex-1 bg-white px-5 pt-6"
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Text className="text-2xl font-bold text-blue-600 text-center mb-6">
        ✏️ Chỉnh sửa bãi đỗ xe
      </Text>

      {/* --- Tên bãi --- */}
      <Text className="text-gray-700 font-semibold mb-2">Tên bãi đỗ</Text>
      <TextInput
        value={lot.name}
        onChangeText={(text) => setLot({ ...lot, name: text })}
        className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 mb-4"
        placeholder="Nhập tên bãi đỗ"
      />

      {/* --- Địa chỉ --- */}
      <Text className="text-gray-700 font-semibold mb-2">Địa chỉ</Text>
      <TextInput
        value={lot.street}
        onChangeText={(v) => setLot({ ...lot, street: v })}
        className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 mb-2"
        placeholder="Đường"
      />
      <TextInput
        value={lot.district}
        onChangeText={(v) => setLot({ ...lot, district: v })}
        className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 mb-2"
        placeholder="Quận / Huyện"
      />
      <TextInput
        value={lot.city}
        onChangeText={(v) => setLot({ ...lot, city: v })}
        className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 mb-4"
        placeholder="Thành phố"
      />

      {/* --- Ảnh --- */}
      <Text className="text-gray-700 font-semibold mb-2">Ảnh đại diện</Text>
      <TouchableOpacity
        onPress={() => pickImage(true)}
        className="bg-blue-50 border border-blue-200 rounded-xl py-3 mb-3 items-center"
      >
        <Text className="text-blue-600 font-medium">🖼️ Chọn ảnh đại diện</Text>
      </TouchableOpacity>

      {avatar && (
        <Image
          source={{ uri: avatar }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 10,
            alignSelf: "center",
            marginBottom: 4,
          }}
        />
      )}

      <Text className="text-gray-700 font-semibold mb-2">Ảnh bãi đỗ</Text>
      <TouchableOpacity
        onPress={() => pickImage(false)}
        className="bg-blue-50 border border-blue-200 rounded-xl py-3 mb-3 items-center"
      >
        <Text className="text-blue-600 font-medium">📷 Thêm ảnh bãi</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          {images.map((uri, i) => (
            <TouchableOpacity key={i} onPress={() => removeImage(i)}>
              <Image
                source={{ uri }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* --- Nút Lưu --- */}
      <TouchableOpacity
        disabled={loading}
        onPress={handleUpdate}
        style={{ marginTop: 8, marginBottom: 20 }}
      >
        <LinearGradient
          colors={["#2563EB", "#60A5FA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center">
              <Ionicons
                name="save-outline"
                size={22}
                color="white"
                style={{ marginRight: 6 }}
              />
              <Text className="text-white text-lg font-semibold">
                Lưu thay đổi
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default EditParkingLotForm;
