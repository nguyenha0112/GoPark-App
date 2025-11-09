import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native";
import LoginForm, { UserRole } from "../../components/LoginForm";

export default function Login() {
  const router = useRouter();

  const handleLoginSuccess = (role: UserRole, username: string) => {
    if (role === "user") router.replace("/(tabs)/home" as any);
    else if (role === "owner") router.replace("/(owner)/management" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => router.push("/(auth)/register" as any)}
      />
    </SafeAreaView>
  );
}
