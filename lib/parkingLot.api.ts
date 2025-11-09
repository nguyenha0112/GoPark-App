
// lib/parkingLot.api.ts
import { fetchWithAuth } from "./api";

/**
 * 🟢 Lấy danh sách bãi đỗ của chủ hiện tại
 * Endpoint: GET /api/v1/parkinglots/my-parkinglots
 */
export async function getMyParkingLots() {
  try {
    const res = await fetchWithAuth("/api/v1/parkinglots/my-parkinglots");

    // Nếu API đã tự trả JSON, chỉ cần kiểm tra res.data
    if (!res || !res.data) {
      throw new Error("Không thể lấy danh sách bãi đỗ");
    }

    return res.data; // luôn trả mảng
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy bãi đỗ:", error.message);
    throw error;
  }
}

/**
 * 🟢 Tạo bãi đỗ mới
 * Endpoint: POST /api/v1/parkinglots
 */
export async function createParkingLot(payload: {
  name: string;
  address: string;
  city: string;
  totalSlots: number;
}) {
  try {
    const res = await fetchWithAuth("/api/v1/parkinglots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res || !res.data) {
      throw new Error("Không thể tạo bãi đỗ mới");
    }

    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi tạo bãi đỗ:", error.message);
    throw error;
  }
}

/**
 * 🟡 Cập nhật thông tin bãi đỗ
 * Endpoint: PATCH /api/v1/parkinglots/:id
 */
export async function updateParkingLot(
  id: string,
  updates: Partial<{
    name: string;
    address: string;
    city: string;
    totalSlots: number;
    status: string;
  }>
) {
  try {
    const res = await fetchWithAuth(`/api/v1/parkinglots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res || !res.data) {
      throw new Error("Không thể cập nhật bãi đỗ");
    }

    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi cập nhật bãi đỗ:", error.message);
    throw error;
  }
}

/**
 * 🔴 Xóa vĩnh viễn bãi đỗ
 * Endpoint: DELETE /api/v1/parkinglots/:id
 */
export async function deleteParkingLot(id: string) {
  try {
    const res = await fetchWithAuth(`/api/v1/parkinglots/${id}`, {
      method: "DELETE",
    });

    if (!res || res.status >= 400) {
      throw new Error("Không thể xóa bãi đỗ");
    }

    return true;
  } catch (error: any) {
    console.error("❌ Lỗi khi xóa bãi đỗ:", error.message);
    throw error;
  }
}
