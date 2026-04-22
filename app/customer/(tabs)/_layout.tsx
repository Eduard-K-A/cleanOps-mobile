import React from 'react';
import { Tabs } from 'expo-router';
import BottomNav from '@/components/shared/BottomNav';

export default function CustomerTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'none', // Critical for instant switching
      }}
    >
      <Tabs.Screen name="index"   />
      <Tabs.Screen name="jobs"    />
      <Tabs.Screen name="wallet"  />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
