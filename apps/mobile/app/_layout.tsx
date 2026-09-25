import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/auth';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
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

  useEffect(() => {
    if (!hydrated) return;
    const onLoginScreen = segments[0] === 'login';
    if (!token && !onLoginScreen) {
      router.replace('/login');
    } else if (token && onLoginScreen) {
      router.replace('/(tabs)/dashboard');
    }
  }, [hydrated, token, segments, router]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brandDark }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppBootstrap>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="leads/[id]" options={{ headerShown: true, title: 'Lead' }} />
            <Stack.Screen name="leads/edit" options={{ headerShown: true, title: 'Edit lead' }} />
            <Stack.Screen name="leads/notes" options={{ headerShown: true, title: 'Notes' }} />
          </Stack>
        </AppBootstrap>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
