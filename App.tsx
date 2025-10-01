import React, { useEffect, useRef } from 'react';
import { Platform, LogBox } from 'react-native';
// import * as Sentry from 'sentry-expo';

import { SubscriptionProvider } from './app/subscription/Subscription';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './app/Home';
import Player from './app/Player';
import Profile from './app/Profile';
import { DailyProgressProvider } from './app/DailyProgress';

import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';

import { SessionProvider, useSession } from './app/session/Session';
import Login from './app/auth/Login';
import Otp from './app/auth/Otp';

// i18n
import './app/i18n';
import { loadSavedLanguage } from './app/i18n/lang';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Paywall from './app/Paywall';

// --- Dev: приглушаем сообщение expo-notifications в Expo Go ---
LogBox.ignoreLogs([
  /Android Push notifications \(remote notifications\) functionality provided by expo-notifications was removed from Expo Go/i,
]);

// Уведомления (локальные): показывать баннеры в форграунде
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

function RootStacks() {
  const { token, initializing } = useSession();
  if (initializing) return null;

  if (token) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ title: 'VSH25' }} />
        <Stack.Screen name="Player" component={Player} options={{ title: 'Player' }} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
        <Stack.Screen name="Paywall" component={Paywall} options={{ title: 'Подписка' }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ title: 'Вход' }} />
      <Stack.Screen name="Otp" component={Otp} options={{ title: 'Подтверждение' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  // ── Шрифты Rubik — внутри компонента ───────────────────────────────
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
    'Rubik-Medium': require('./assets/fonts/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('./assets/fonts/Rubik-SemiBold.ttf'),
    'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
  });
  if (!fontsLoaded) return null;
  // ──────────────────────────────────────────────────────────────────

  // React Query client
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
        mutations: { retry: 0 },
      },
    });
  }

  useEffect(() => {
    (async () => {
      try { await loadSavedLanguage(); } catch {}
      await Notifications.requestPermissionsAsync();
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF0000',
        });
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <SessionProvider>
        <SubscriptionProvider>
          <DailyProgressProvider>
            <NavigationContainer>
              <RootStacks />
            </NavigationContainer>
          </DailyProgressProvider>
        </SubscriptionProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}