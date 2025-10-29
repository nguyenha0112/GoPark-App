import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  totalSlots: number;
  occupiedSlots: number;
  status: "active" | "pending";
}

interface MyParkingLotsScreenProps {
  parkingLots: ParkingLot[];
  onSelectParkingLot: (id: string) => void;
  onAddParkingLot: () => void;
  onEditParkingLot?: (id: string) => void;
  onDeleteParkingLot?: (id: string) => void;
}

export const MyParkingLotsScreen: React.FC<MyParkingLotsScreenProps> = ({
  parkingLots,
  onSelectParkingLot,
  onAddParkingLot,
  onEditParkingLot,
  onDeleteParkingLot,
}) => {
  const router = useRouter();

  // 👉 Sự kiện đăng xuất
  const handleLogout = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user"); // nếu bạn có lưu user info
            router.replace("/login"); // quay lại màn hình đăng nhập
          } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ParkingLot }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => onSelectParkingLot(item.id)}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === "active" ? "#E9FCEB" : "#FFF6E6",
            },
          ]}
        >
          <Ionicons
            name={
              item.status === "active" ? "checkmark-circle" : "time-outline"
            }
            size={14}
            color={item.status === "active" ? "#16a34a" : "#f59e0b"}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === "active" ? "#166534" : "#92400E",
              },
            ]}
          >
            {item.status === "active" ? "Hoạt động" : "Chờ duyệt"}
          </Text>
        </View>
      </View>

      <Text style={styles.address}>
        <Ionicons name="location-outline" size={14} color="#6b7280" />{" "}
        {item.address}
      </Text>

      <View style={styles.slotInfo}>
        <Ionicons name="car-outline" size={14} color="#1f2937" />
        <Text style={styles.slots}>
          {" "}
          {item.occupiedSlots}/{item.totalSlots} chỗ
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onEditParkingLot?.(item.id)}
        >
          <Ionicons name="create-outline" size={18} color="#2563eb" />
          <Text style={[styles.iconText, { color: "#2563eb" }]}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            Alert.alert("Xác nhận", "Xóa bãi đỗ này?", [
              { text: "Hủy", style: "cancel" },
              {
                text: "Xóa",
                style: "destructive",
                onPress: () => onDeleteParkingLot?.(item.id),
              },
            ])
          }
        >
          <Ionicons name="trash-outline" size={18} color="#dc2626" />
          <Text style={[styles.iconText, { color: "#dc2626" }]}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bãi đỗ của tôi</Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#7c3aed" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {parkingLots.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="car-sport-outline" size={60} color="#9ca3af" />
          <Text style={styles.emptyText}>
            Bạn chưa có bãi đỗ nào.{"\n"}Hãy thêm bãi đỗ đầu tiên!
          </Text>
        </View>
      ) : (
        <FlatList
          data={parkingLots}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Nút thêm mới */}
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.85}
        onPress={onAddParkingLot}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", paddingHorizontal: 16 },
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1e1b4b" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f3ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  logoutText: {
    color: "#7c3aed",
    fontWeight: "600",
    fontSize: 13,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: { fontSize: 16, fontWeight: "700", color: "#111827" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  statusText: { fontSize: 13, fontWeight: "600" },
  address: { fontSize: 14, color: "#6b7280", marginBottom: 4 },
  slotInfo: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  slots: { fontSize: 14, color: "#1f2937" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 22,
  },
  iconButton: { flexDirection: "row", alignItems: "center" },
  iconText: { fontSize: 13, marginLeft: 4, fontWeight: "500" },
  addButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#7c3aed",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyBox: { marginTop: 120, alignItems: "center", gap: 10 },
  emptyText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
});
