import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { SubscriptionProvider } from './app/subscription/Subscription';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './app/Home';
import Player from './app/Player';
import Profile from './app/Profile';
import { DailyProgressProvider } from './app/DailyProgress';

import * as Notifications from 'expo-notifications';
// import { useFonts } from 'expo-font';

import { SessionProvider, useSession } from './app/session/Session';
import Login from './app/auth/Login';
import Otp from './app/auth/Otp';

// i18n — инициализация
import './app/i18n';
import { loadSavedLanguage } from './app/i18n/lang';

// React Query — провайдер для хуков (например, useRateVideo)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Paywall from './app/Paywall';

// Уведомления: показывать даже в форграунде
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // iOS: показывать баннер и класть в список уведомлений
    shouldShowBanner: true,
    shouldShowList: true,
    // общие флаги
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

function RootStacks() {
  const { token, initializing } = useSession();
  if (initializing) return null; // можно показать splash

  // Только стек; NavigationContainer теперь в корне App
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
  // Шрифты пока отключены, чтобы не падало на отсутствии файлов
  // const [fontsLoaded] = useFonts({
  //   'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
  //   'Rubik-Medium': require('./assets/fonts/Rubik-Medium.ttf'),
  //   'Rubik-SemiBold': require('./assets/fonts/Rubik-SemiBold.ttf'),
  //   'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
  // });
  // if (!fontsLoaded) return null;

  // Создаём один QueryClient на весь срок жизни приложения
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