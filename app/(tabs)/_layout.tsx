import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="booking" options={{ title: 'Đặt chỗ' }} />
      <Tabs.Screen name="history" options={{ title: 'Lịch sử' }} />
      <Tabs.Screen name="profile" options={{ title: 'Hồ sơ' }} />
    </Tabs>
  );
}