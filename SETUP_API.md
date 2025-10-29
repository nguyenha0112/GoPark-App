# Cấu hình API động cho GoPark App

## 🚀 Setup nhanh khi clone dự án

### Bước 1: Clone và cài đặt dependencies
```bash
git clone <repository-url>
cd GoPark-App
npm install
```

### Bước 2: Tự động cấu hình địa chỉ IP
```bash
npm run setup-env
```

Script này sẽ tự động:
- Phát hiện địa chỉ IP local của máy bạn
- Tạo file `.env` với cấu hình phù hợp
- Hiển thị hướng dẫn cấu hình cho từng môi trường

### Bước 3: Chỉnh sửa `.env` nếu cần

Mở file `.env` và điều chỉnh `API_BASE_URL` theo môi trường test:

```env
# Android Emulator
API_BASE_URL=http://10.0.2.2:5000

# iOS Simulator  
API_BASE_URL=http://localhost:5000

# Physical Device (cùng WiFi)
API_BASE_URL=http://192.168.1.20:5000
```

### Bước 4: Khởi động backend
```bash
cd ../GoPark-BE
npm run dev
```

### Bước 5: Khởi động app
```bash
cd ../GoPark-App
npx expo start --clear
```

**Lưu ý:** Luôn dùng `--clear` hoặc `-c` để clear cache khi thay đổi `.env`

## 📱 Hướng dẫn theo từng môi trường

### Android Emulator
```env
API_BASE_URL=http://10.0.2.2:5000
```
- `10.0.2.2` là địa chỉ đặc biệt của Android Emulator trỏ về `localhost` của máy host

### iOS Simulator
```env
API_BASE_URL=http://localhost:5000
```
- iOS Simulator chia sẻ network với máy Mac

### Physical Device (Điện thoại thật)
```env
API_BASE_URL=http://192.168.1.20:5000
```
- Thay `192.168.1.20` bằng IP của máy bạn
- Đảm bảo điện thoại và máy tính cùng mạng WiFi
- Kiểm tra firewall không chặn port 5000

## 🔧 Troubleshooting

### Lỗi "Network request failed"
1. Kiểm tra backend đang chạy: `cd GoPark-BE && npm run dev`
2. Kiểm tra IP trong `.env` đúng chưa
3. Kiểm tra firewall/antivirus
4. Thử chạy lại: `npm run setup-env`

### Thay đổi IP
Khi địa chỉ IP thay đổi (đổi mạng WiFi, DHCP):
```bash
npm run setup-env
```

### Clear cache Expo
```bash
npx expo start -c
```

## 📝 Lưu ý quan trọng

- File `.env` không được commit lên Git (đã thêm vào `.gitignore`)
- File `.env.example` là template, có thể commit
- Mỗi người clone về cần chạy `npm run setup-env` để tạo `.env` riêng
- Khi đổi IP, chỉ cần chạy lại `npm run setup-env`

## 🎯 Best Practices

1. **Luôn chạy `npm run setup-env` sau khi clone**
2. **Kiểm tra backend chạy trước khi test app**
3. **Đảm bảo cùng mạng WiFi** (cho physical device)
4. **Restart Expo** sau khi thay đổi `.env`
