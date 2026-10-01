import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '@/store/auth';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { registerForPushNotificationsAsync } from '@/services/notifications';
import { registerDevice } from '@/api/devices';
import { colors } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      gcTime: 1000 * 60 * 30,
    },
  },
});

function AppBootstrap({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.token);
  const segments = useSegments();
  const router = useRouter();
  useNetworkStatus();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const onLoginScreen = segments[0] === 'login';

  useEffect(() => {
    if (!hydrated) return;
    if (!token && !onLoginScreen) {
      router.replace('/login');
    } else if (token && onLoginScreen) {
      router.replace('/(tabs)/dashboard');
    }
  }, [hydrated, token, onLoginScreen, router]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      const pushToken = await registerForPushNotificationsAsync();
      if (!pushToken || cancelled) return;
      try {
        await registerDevice(pushToken, Platform.OS === 'ios' ? 'ios' : 'android');
      } catch (err) {
        console.warn('[push] Failed to register device:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { leadId?: string } | undefined;
      if (data?.leadId) {
        router.push(`/leads/${data.leadId}`);
      } else {
        router.push('/(tabs)/leads');
      }
    });
    return () => sub.remove();
  }, [router]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brandDark }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={onLoginScreen ? 'light' : 'dark'} animated />
      {children}
    </>
  );
}

const headerOptions = {
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: { color: colors.text, fontWeight: '700' as const, fontSize: 17 },
  headerTintColor: colors.brand,
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppBootstrap>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="leads/[id]" options={{ ...headerOptions, headerShown: true, title: 'Lead' }} />
              <Stack.Screen name="leads/new" options={{ ...headerOptions, headerShown: true, title: 'Add lead' }} />
              <Stack.Screen name="leads/edit" options={{ ...headerOptions, headerShown: true, title: 'Edit lead' }} />
              <Stack.Screen name="leads/notes" options={{ ...headerOptions, headerShown: true, title: 'Notes' }} />
            </Stack>
          </AppBootstrap>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
