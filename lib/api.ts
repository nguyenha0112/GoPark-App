import AsyncStorage from "@react-native-async-storage/async-storage";

// Thay bằng IP LAN máy bạn
export const BASE_URL = "http://192.168.2.17:5000"; // ví dụ: 192.168.2.17

// Helper fetch có JWT
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Request failed");
  }

  return res.json();
}

// Login
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/v1/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Login failed");
  }

  return res.json();
}
