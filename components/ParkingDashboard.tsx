import { LinearGradient } from "expo-linear-gradient";
import {
  Car,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ParkingDashboardScreenProps {
  parkingLotName: string;
  onBack: () => void;
}

export function ParkingDashboardScreen({
  parkingLotName,
  onBack,
}: ParkingDashboardScreenProps) {
  const [tab, setTab] = useState<"overview" | "slots" | "reports">("overview");

  const stats = {
    totalRevenue: 48000000,
    todayRevenue: 1200000,
    totalSlots: 200,
    occupiedSlots: 130,
  };

  const mockSlots = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    number: `A${(i + 1).toString().padStart(2, "0")}`,
    status: i % 3 === 0 ? "occupied" : i % 5 === 0 ? "reserved" : "available",
  }));

  return (
    <View style={styles.container}>
      {/* Header gradient */}
      <LinearGradient colors={["#7c3aed", "#6d28d9"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{parkingLotName}</Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: "overview", label: "Tổng quan" },
          { key: "slots", label: "Bãi đỗ" },
          { key: "reports", label: "Báo cáo" },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => setTab(item.key as any)}
            style={[
              styles.tabButton,
              tab === item.key && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[styles.tabText, tab === item.key && styles.tabTextActive]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {tab === "overview" && (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <DollarSign color="#6b21a8" size={22} />
                <Text style={styles.statLabel}>Doanh thu hôm nay</Text>
                <Text style={styles.statValue}>
                  {stats.todayRevenue.toLocaleString("vi-VN")}đ
                </Text>
              </View>
              <View style={styles.statCard}>
                <Users color="#6b21a8" size={22} />
                <Text style={styles.statLabel}>Đang sử dụng</Text>
                <Text style={styles.statValue}>
                  {stats.occupiedSlots}/{stats.totalSlots}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#16a34a" }]}
              >
                <CheckCircle2 color="white" size={20} />
                <Text style={styles.actionText}>Check-in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#dc2626" }]}
              >
                <XCircle color="white" size={20} />
                <Text style={styles.actionText}>Check-out</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {tab === "slots" && (
          <>
            <Text style={styles.sectionTitle}>Danh sách chỗ đỗ</Text>
            <View style={styles.slotsGrid}>
              {mockSlots.map((slot) => (
                <View
                  key={slot.id}
                  style={[
                    styles.slotBox,
                    slot.status === "available"
                      ? styles.slotAvailable
                      : slot.status === "occupied"
                      ? styles.slotOccupied
                      : styles.slotReserved,
                  ]}
                >
                  <Car
                    color={
                      slot.status === "available"
                        ? "#22c55e"
                        : slot.status === "occupied"
                        ? "#ef4444"
                        : "#eab308"
                    }
                    size={18}
                  />
                  <Text style={styles.slotText}>{slot.number}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {tab === "reports" && (
          <View style={styles.reportBox}>
            <TrendingUp color="#6b21a8" size={22} />
            <Text style={styles.reportText}>
              Tổng doanh thu:{" "}
              <Text style={{ fontWeight: "700", color: "#4c1d95" }}>
                {stats.totalRevenue.toLocaleString("vi-VN")}đ
              </Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: { flexDirection: "column", gap: 6 },
  backText: { color: "#e0e7ff", fontSize: 14 },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#ede9fe",
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: "#ede9fe",
  },
  tabText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#6d28d9",
    fontWeight: "700",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statLabel: { color: "#6b7280", fontSize: 13, marginTop: 6 },
  statValue: {
    color: "#4c1d95",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4c1d95",
    marginBottom: 10,
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  slotBox: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1.5,
  },
  slotAvailable: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  },
  slotOccupied: {
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
  },
  slotReserved: {
    backgroundColor: "#fefce8",
    borderColor: "#fde68a",
  },
  slotText: { fontWeight: "600", color: "#374151", fontSize: 13 },
  reportBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  reportText: {
    color: "#374151",
    fontSize: 15,
    flexShrink: 1,
  },
});
