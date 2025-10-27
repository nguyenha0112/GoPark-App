import { Tabs } from 'expo-router';

export default function OwnerLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="management" options={{ title: 'Quản lý' }} />
    </Tabs>
  );
}