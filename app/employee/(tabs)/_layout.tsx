import React from 'react';
import { Tabs } from 'expo-router';
import EmployeeBottomNav from '@/components/employee/EmployeeBottomNav';

export default function EmployeeTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <EmployeeBottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Tabs.Screen name="index"   />
      <Tabs.Screen name="active"  />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="wallet"  />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
