import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Địa chỉ API động - cấu hình trong file .env
// Android Emulator: http://10.0.2.2:5000
// iOS Simulator: http://localhost:5000
// Physical Device: http://YOUR_LOCAL_IP:5000
// local của nguyên 192.168.1.194
export const BASE_URL = "http://192.168.1.194:5000";

// Debug log để kiểm tra
console.log("🔗 API BASE_URL:", BASE_URL);
console.log("📦 Expo Config Extra:", Constants.expoConfig?.extra);

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

// Đăng ký
export async function registerUser(
  name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
) {
  const res = await fetch(`${BASE_URL}/api/v1/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName: name, // ✅ backend dùng userName
      email,
      phoneNumber: phone, // ✅ backend dùng phoneNumber
      password,
      passwordConfirm: confirmPassword, // ✅ backend yêu cầu trường này
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Đăng ký thất bại");
  }

  return data; // Trả về user + token (tùy backend)
}
