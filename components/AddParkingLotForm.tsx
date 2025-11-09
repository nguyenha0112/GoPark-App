import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createParkingLot } from "../lib/parkingLot.api";

export default function AddParkingLotForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    street: "",
    district: "",
    city: "",
    description: "",
    pricePerHour: "",
    latitude: "21.028511",
    longitude: "105.854444",
  });

  const [paymentMethods, setPaymentMethods] = useState<string[]>(["prepaid"]);
  const [zoneCount, setZoneCount] = useState(1);
  const [zones, setZones] = useState([{ zone: "A", count: 10 }]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const togglePayment = (method: string) => {
    setPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

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

  const handleZoneCount = (count: number) => {
    const newZones = [];
    for (let i = 0; i < count; i++) {
      const zoneName = String.fromCharCode(65 + i);
      newZones.push({
        zone: zoneName,
        count: zones[i]?.count || 10,
      });
    }
    setZoneCount(count);
    setZones(newZones);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.street || !form.city || !form.pricePerHour) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập đầy đủ các trường bắt buộc!"
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        address: `${form.street}, ${form.district}, ${form.city}`,
        description: form.description || "Không có mô tả",
        city: form.city.trim(),
        pricePerHour: Number(form.pricePerHour),
        zones,
        allowedPaymentMethods: paymentMethods,
        totalSlots: zones.reduce((acc, z) => acc + z.count, 0),
        location: {
          type: "Point",
          coordinates: [Number(form.longitude), Number(form.latitude)],
        },
      };

      await createParkingLot(payload);
      Alert.alert("✅ Thành công", "Đã tạo bãi đỗ xe mới!");
      setForm({
        name: "",
        street: "",
        district: "",
        city: "",
        description: "",
        pricePerHour: "",
        latitude: "21.028511",
        longitude: "105.854444",
      });
      setPaymentMethods(["prepaid"]);
      setZoneCount(1);
      setZones([{ zone: "A", count: 10 }]);
      setAvatar(null);
      setImages([]);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      Alert.alert("❌ Lỗi", error.message || "Không thể tạo bãi đỗ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#2563EB",
            marginVertical: 20,
            textAlign: "center",
          }}
        >
          🅿️ Tạo bãi đỗ xe mới
        </Text>

        {/* --- Thông tin cơ bản --- */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Thông tin cơ bản
        </Text>
        {[
          { key: "name", label: "Tên bãi đỗ" },
          { key: "street", label: "Đường" },
          { key: "district", label: "Quận / Huyện" },
          { key: "city", label: "Thành phố" },
          { key: "pricePerHour", label: "Giá mỗi giờ (VND)", type: "numeric" },
        ].map((f) => (
          <View key={f.key} style={{ marginBottom: 12 }}>
            <Text style={{ color: "#333", marginBottom: 6 }}>{f.label}</Text>
            <TextInput
              value={form[f.key as keyof typeof form]}
              onChangeText={(v) => handleChange(f.key, v)}
              keyboardType={f.type as any}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 10,
                padding: 10,
                backgroundColor: "#F9FAFB",
              }}
            />
          </View>
        ))}

        {/* --- Tọa độ --- */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginVertical: 10 }}>
          Tọa độ (Latitude / Longitude)
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TextInput
            value={form.latitude}
            onChangeText={(v) => handleChange("latitude", v)}
            placeholder="Vĩ độ"
            keyboardType="numeric"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 10,
              backgroundColor: "#F9FAFB",
            }}
          />
          <TextInput
            value={form.longitude}
            onChangeText={(v) => handleChange("longitude", v)}
            placeholder="Kinh độ"
            keyboardType="numeric"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 10,
              backgroundColor: "#F9FAFB",
            }}
          />
        </View>

        {/* --- Mô tả --- */}
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
            Mô tả (tuỳ chọn)
          </Text>
          <TextInput
            value={form.description}
            onChangeText={(v) => handleChange("description", v)}
            multiline
            numberOfLines={4}
            placeholder="Nhập mô tả bãi đỗ xe..."
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 10,
              backgroundColor: "#F9FAFB",
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* --- Khu vực --- */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginVertical: 12 }}>
          Khu vực (Zones)
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ flex: 1, fontSize: 16 }}>Số khu vực:</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              backgroundColor: "#F9FAFB",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (zoneCount > 1) handleZoneCount(zoneCount - 1);
              }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ fontSize: 18, color: "#2563EB" }}>－</Text>
            </TouchableOpacity>

            <Text
              style={{
                width: 40,
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {zoneCount}
            </Text>

            <TouchableOpacity
              onPress={() => handleZoneCount(zoneCount + 1)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ fontSize: 18, color: "#2563EB" }}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {zones.map((z, i) => (
          <View
            key={z.zone}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>
              Khu vực {z.zone}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 10,
                backgroundColor: "#F9FAFB",
                marginBottom: 6,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  const updated = [...zones];
                  if (updated[i].count > 1) {
                    updated[i].count -= 1;
                    setZones(updated);
                  }
                }}
                style={{ paddingHorizontal: 12, paddingVertical: 6 }}
              >
                <Text style={{ fontSize: 18, color: "#2563EB" }}>－</Text>
              </TouchableOpacity>

              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {z.count}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  const updated = [...zones];
                  updated[i].count += 1;
                  setZones(updated);
                }}
                style={{ paddingHorizontal: 12, paddingVertical: 6 }}
              >
                <Text style={{ fontSize: 18, color: "#2563EB" }}>＋</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
            >
              {Array.from({ length: z.count }).map((_, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: "#DBEAFE",
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                    margin: 2,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#1E40AF" }}>
                    {z.zone}
                    {idx + 1}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* --- Phương thức thanh toán --- */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginVertical: 10 }}>
          Phương thức thanh toán
        </Text>
        {[
          { label: "Trả trước (Prepaid)", value: "prepaid" },
          { label: "Trả tại bãi (Pay at parking)", value: "pay-at-parking" },
        ].map((m) => (
          <TouchableOpacity
            key={m.value}
            onPress={() => togglePayment(m.value)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                marginRight: 10,
                borderWidth: 2,
                borderColor: "#1E3A8A",
                borderRadius: 4,
                backgroundColor: paymentMethods.includes(m.value)
                  ? "#2563EB"
                  : "white",
              }}
            />
            <Text>{m.label}</Text>
          </TouchableOpacity>
        ))}

        {/* --- Ảnh --- */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginVertical: 10 }}>
          Hình ảnh
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => pickImage(true)}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: "#E0F2FE",
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text>🖼️ Ảnh đại diện</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => pickImage(false)}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: "#E0F2FE",
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text>📷 Thêm ảnh bãi</Text>
          </TouchableOpacity>
        </View>

        {avatar && (
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <Image
              source={{ uri: avatar }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
            <Text style={{ fontSize: 12, color: "#555" }}>Ảnh đại diện</Text>
          </View>
        )}

        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
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

        {/* --- Submit --- */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{ marginTop: 30 }}
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
              <Text
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                🚗 Tạo bãi đỗ xe
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
