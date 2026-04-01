import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';
import { usePlayerStore } from '@/store/playerStore';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const { token, isLoading, loadToken } = useAuthStore();
  const initPlayer = usePlayerStore((state) => state.initPlayer);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadToken();
    initPlayer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)/feed');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isLoading]);

  if (isLoading) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="player"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
