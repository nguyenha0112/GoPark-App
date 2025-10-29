import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";

export default function TestConnection() {
  const [status, setStatus] = useState<"testing" | "success" | "error">("testing");
  const [message, setMessage] = useState("");
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus("testing");
    const baseUrl = Constants.expoConfig?.extra?.apiBaseUrl || "http://localhost:5000";
    setApiUrl(baseUrl);
    
    try {
      const response = await fetch(`${baseUrl}/api/v1/users`, {
        method: "GET",
      });

      if (response.status === 401) {
        setStatus("success");
        setMessage("✅ Backend đang hoạt động! (401 Unauthorized là bình thường)");
      } else if (response.ok) {
        setStatus("success");
        setMessage("✅ Kết nối thành công!");
      } else {
        setStatus("error");
        setMessage(`❌ Lỗi: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(`❌ Không thể kết nối: ${error.message}`);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-gray-50">
      <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <Text className="text-2xl font-bold text-center mb-4">
          Test Kết Nối Backend
        </Text>

        <View className="bg-blue-50 p-3 rounded-lg mb-4">
          <Text className="text-sm text-gray-700 mb-1">API URL:</Text>
          <Text className="text-xs font-mono text-blue-700">{apiUrl}</Text>
        </View>

        {status === "testing" && (
          <View className="items-center py-4">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-600 mt-2">Đang kiểm tra kết nối...</Text>
          </View>
        )}

        {status === "success" && (
          <View className="items-center py-4">
            <Text className="text-4xl mb-2">✅</Text>
            <Text className="text-green-700 text-center font-semibold">
              {message}
            </Text>
          </View>
        )}

        {status === "error" && (
          <View className="items-center py-4">
            <Text className="text-4xl mb-2">❌</Text>
            <Text className="text-red-600 text-center font-semibold">
              {message}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={testConnection}
          className="bg-blue-600 py-3 rounded-xl mt-4"
        >
          <Text className="text-white text-center font-semibold">
            Kiểm tra lại
          </Text>
        </TouchableOpacity>

        <View className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <Text className="text-xs text-gray-700 font-semibold mb-1">
            💡 Ghi chú:
          </Text>
          <Text className="text-xs text-gray-600">
            • Android Emulator: http://10.0.2.2:5000{"\n"}
            • iOS Simulator: http://localhost:5000{"\n"}
            • Physical Device: http://192.168.1.20:5000
          </Text>
        </View>
      </View>
    </View>
  );
}
