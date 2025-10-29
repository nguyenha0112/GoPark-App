#!/usr/bin/env node

/**
 * Script tự động cấu hình API_BASE_URL dựa trên địa chỉ IP local
 * Chạy: npm run setup-env
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

// Lấy địa chỉ IP local
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Bỏ qua địa chỉ internal và IPv6
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

// Tạo file .env
function setupEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  const localIp = getLocalIpAddress();
  const port = process.env.PORT || '5000';
  
  const envContent = `# API Configuration
# Tự động phát hiện địa chỉ IP máy chủ
# Thay đổi theo môi trường:
# - Android Emulator: http://10.0.2.2:5000
# - iOS Simulator: http://localhost:5000
# - Physical Device: http://${localIp}:${port}

API_BASE_URL=http://${localIp}:${port}
`;

  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ File .env đã được tạo thành công!');
    console.log(`📍 API_BASE_URL: http://${localIp}:${port}`);
    console.log('\n📝 Lưu ý:');
    console.log('   - Android Emulator: Đổi thành http://10.0.2.2:5000');
    console.log('   - iOS Simulator: Đổi thành http://localhost:5000');
    console.log(`   - Physical Device (WiFi): Giữ nguyên http://${localIp}:${port}`);
  } catch (error) {
    console.error('❌ Lỗi khi tạo file .env:', error.message);
    process.exit(1);
  }
}

setupEnvFile();
