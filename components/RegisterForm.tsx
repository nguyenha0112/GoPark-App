import { ArrowLeft, Lock, Mail, Phone, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "owner";
}

type ErrorField =
  | "name"
  | "email"
  | "phone"
  | "password"
  | "confirmPassword"
  | "terms";

interface RegisterFormProps {
  onRegister: (user: User) => void;
  onBack?: () => void;
}

export default function RegisterForm({
  onRegister,
  onBack,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState<Record<ErrorField, string>>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const validateField = (field: ErrorField, value: string) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value) error = "Họ và tên không được để trống";
        break;
      case "email":
        if (!value) error = "Email không được để trống";
        else if (!emailRegex.test(value)) error = "Email không hợp lệ";
        break;
      case "phone":
        if (!value) error = "Số điện thoại không được để trống";
        else if (!phoneRegex.test(value))
          error = "Số điện thoại không hợp lệ (9-15 chữ số)";
        break;
      case "password":
        if (!value) error = "Mật khẩu không được để trống";
        else if (value.length < 8) error = "Mật khẩu phải ≥ 8 ký tự";
        break;
      case "confirmPassword":
        if (!value) error = "Xác nhận mật khẩu không được để trống";
        else if (value !== password) error = "Mật khẩu không khớp";
        break;
      case "terms":
        if (!termsAccepted) error = "Bạn phải đồng ý điều khoản";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleRegister = () => {
    const valid =
      validateField("name", name) &&
      validateField("email", email) &&
      validateField("phone", phone) &&
      validateField("password", password) &&
      validateField("confirmPassword", confirmPassword) &&
      validateField("terms", "");

    if (!valid) return;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: "user",
    };

    onRegister(newUser);
    Alert.alert("Thành công", "Đăng ký thành công!");
  };

  const inputFields: {
    label: string;
    icon: typeof User;
    value: string;
    setter: (text: string) => void;
    field: ErrorField;
    placeholder: string;
    secure?: boolean;
    keyboard?: any;
  }[] = [
    {
      label: "Họ và tên",
      icon: User,
      value: name,
      setter: setName,
      field: "name",
      placeholder: "Nguyễn Văn A",
    },
    {
      label: "Email",
      icon: Mail,
      value: email,
      setter: setEmail,
      field: "email",
      placeholder: "email@example.com",
      keyboard: "email-address",
    },
    {
      label: "Số điện thoại",
      icon: Phone,
      value: phone,
      setter: setPhone,
      field: "phone",
      placeholder: "0123456789",
      keyboard: "phone-pad",
    },
    {
      label: "Mật khẩu",
      icon: Lock,
      value: password,
      setter: setPassword,
      field: "password",
      placeholder: "••••••••",
      secure: true,
    },
    {
      label: "Xác nhận mật khẩu",
      icon: Lock,
      value: confirmPassword,
      setter: setConfirmPassword,
      field: "confirmPassword",
      placeholder: "••••••••",
      secure: true,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Back arrow header */}
      <View className="flex-row items-center mb-4">
        {onBack && (
          <TouchableOpacity onPress={onBack} className="p-2">
            <ArrowLeft color="black" size={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* Form container */}
      <View className="bg-white rounded-2xl p-4 shadow-md">
        {/* Header inside form */}
        <View className="items-center mb-5">
          <Text className="text-2xl font-bold text-black">Tạo tài khoản</Text>
        </View>

        {/* Inputs */}
        {inputFields.map((input, idx) => (
          <View className="mb-3" key={idx}>
            <Text className="text-sm font-medium mb-1 text-black">
              {input.label}
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-12">
              <input.icon color="#9CA3AF" size={18} />
              <TextInput
                className="ml-2 flex-1 text-base text-black"
                placeholder={input.placeholder}
                placeholderTextColor="#9CA3AF"
                value={input.value}
                onChangeText={(text) => {
                  input.setter(text);
                  if (errors[input.field]) validateField(input.field, text);
                }}
                onBlur={() => validateField(input.field, input.value)}
                secureTextEntry={input.secure}
                keyboardType={input.keyboard as any}
                autoCapitalize="none"
                style={{ paddingVertical: 0 }}
              />
            </View>
            {errors[input.field] ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors[input.field]}
              </Text>
            ) : null}
          </View>
        ))}

        {/* Terms */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => setTermsAccepted(!termsAccepted)}
            className="mr-2 w-5 h-5 border-2 border-gray-300 rounded-md items-center justify-center"
          >
            {termsAccepted && <View className="w-3 h-3 bg-black rounded-sm" />}
          </TouchableOpacity>
          <Text className="text-xs text-black flex-1">
            Tôi đồng ý với{" "}
            <Text className="font-semibold">Điều khoản sử dụng</Text> và{" "}
            <Text className="font-semibold">Chính sách bảo mật</Text>
          </Text>
        </View>
        {errors.terms ? (
          <Text className="text-red-500 text-xs mb-2">{errors.terms}</Text>
        ) : null}

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          className="w-full h-12 bg-black rounded-xl items-center justify-center mb-3"
        >
          <Text className="text-white font-medium text-base">Đăng ký</Text>
        </TouchableOpacity>

        {/* Login text */}
        <View className="flex-row justify-center mt-3">
          <Text className="text-sm text-gray-600 mr-1">Đã có tài khoản?</Text>
          <TouchableOpacity onPress={onBack}>
            <Text className="text-sm font-semibold text-black">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
