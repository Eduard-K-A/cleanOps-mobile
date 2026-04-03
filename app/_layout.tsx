import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/authContext';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

function RootNav() {
  const { user, role, loading } = useAuth();
  const segments = useSegments();
  const router   = useRouter();

  useEffect(() => {
    if (loading) return;

    const firstSeg  = segments[0] as string | undefined;
    const inPublic  = !firstSeg || firstSeg === 'homepage' || firstSeg === 'login' || firstSeg === 'signup';

    if (!user) {
      if (!inPublic) router.replace('/homepage');
    } else {
      if (inPublic) {
        if (role === 'employee')      router.replace('/employee/dashboard');
        else if (role === 'admin')    router.replace('/admin/dashboard');
        else                          router.replace('/customer/dashboard');
      }
    }
  }, [user, role, loading, segments]);

  if (loading) return <LoadingScreen message="Starting CleanOps…" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"             />
      <Stack.Screen name="homepage/index"    />
      <Stack.Screen name="login/index"       />
      <Stack.Screen name="signup/index"      />
      <Stack.Screen name="customer/dashboard/index" />
      <Stack.Screen name="customer/order/index"     />
      <Stack.Screen name="customer/requests/index"  />
      <Stack.Screen name="customer/payment/index"   />
      <Stack.Screen name="customer/jobs/[id]/index" />
      <Stack.Screen name="employee/dashboard/index" />
      <Stack.Screen name="employee/feed/index"      />
      <Stack.Screen name="employee/history/index"   />
      <Stack.Screen name="employee/jobs/[id]/index" />
      <Stack.Screen name="admin/dashboard/index"    />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootNav />
    </AuthProvider>
  );
}
