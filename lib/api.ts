import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";


// Địa chỉ API động - cấu hình trong file .env
// Android Emulator: http://10.0.2.2:5000
// iOS Simulator: http://localhost:5000
// Physical Device: http://YOUR_LOCAL_IP:5000
export const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || "http://localhost:5000";

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

  // Nếu request thất bại
  if (!res.ok) {
    // 🧩 Dùng .text() thay vì .json() để tránh lỗi Unexpected end of input
    const errorText = await res.text();
    let errMsg = "Request failed";
    try {
      const errData = JSON.parse(errorText);
      errMsg = errData.message || errMsg;
    } catch {
      if (errorText) errMsg = errorText;
    }
    throw new Error(errMsg);
  }

  // ✅ Nếu là 204 No Content thì trả object rỗng thay vì parse JSON
  if (res.status === 204) {
    return { status: "success", data: null };
  }

  // ✅ Nếu có body thì parse, còn nếu rỗng thì trả null
  const text = await res.text();
  if (!text) {
    return { status: res.status, data: null };
  }

  try {
    return JSON.parse(text);
  } catch {
    return { status: res.status, data: text };
  }
}

// Login
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/v1/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {}

  if (!res.ok) {
    throw new Error((data as any).message || "Login failed");
  }

  return data;
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
      userName: name,
      email,
      phoneNumber: phone,
      password,
      passwordConfirm: confirmPassword,
    }),
  });

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {}

  if (!res.ok) {
    throw new Error((data as any).message || "Đăng ký thất bại");
  }

  return data;
}
