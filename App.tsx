import React, { useEffect, useRef } from 'react';
import { Platform, LogBox } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';

import Home from './app/Home';
import Player from './app/Player';
import Profile from './app/Profile';
import Paywall from './app/Paywall';
import Login from './app/auth/Login';
import Otp from './app/auth/Otp';

import { SessionProvider, useSession } from './app/session/Session';
import { SubscriptionProvider } from './app/subscription/Subscription';
import { GatingProvider } from './app/flags/gating';
import { DailyProgressProvider } from './app/DailyProgress';
import ErrorBoundary from './app/ui/ErrorBoundary';

// i18n
import './app/i18n';
import { loadSavedLanguage } from './app/i18n/lang';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// — приглушаем «remote notifications removed from Expo Go»
LogBox.ignoreLogs([
  /Android Push notifications \(remote notifications\) functionality provided by expo-notifications was removed from Expo Go/i,
]);

// — уведомления: показывать баннеры в форграунде
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
  // теперь из useSession берём user и initializing
  const { user, initializing } = useSession();

  // пока идёт инициализация (чтение токена + попытка /me) ничего не рисуем
  if (initializing) return null;

  const isAuthed = !!user;

  if (isAuthed) {
    // Пользователь залогинен — основной стек приложения
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'VSH25' }}
        />
        <Stack.Screen
          name="Player"
          component={Player}
          options={{ title: 'Player' }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="Paywall"
          component={Paywall}
          options={{ title: 'Подписка' }}
        />
      </Stack.Navigator>
    );
  }

  // Пользователь не залогинен — стек авторизации
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Вход' }} // как на веб-скриншоте
      />
      <Stack.Screen
        name="Otp"
        component={Otp}
        options={{ title: 'Подтверждение' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  // 1) Хук шрифтов — ВСЕГДА вызывать, но проверку делать ПОСЛЕ остальных хуков
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
    'Rubik-Medium': require('./assets/fonts/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('./assets/fonts/Rubik-SemiBold.ttf'),
    'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
  });

  // 2) Хук useRef — ДОЛЖЕН вызваться на каждом рендере (независимо от fontsLoaded)
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
        mutations: { retry: 0 },
      },
    });
  }

  // 3) useEffect — тоже вызываем всегда (даже если шрифты ещё грузятся)
  useEffect(() => {
    (async () => {
      try {
        await loadSavedLanguage();
      } catch {}
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

  // 4) ТОЛЬКО сейчас делаем ранний выход, чтобы порядок хуков не менялся
  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <SessionProvider>
        <SubscriptionProvider>
          <GatingProvider>
            <DailyProgressProvider>
              <ErrorBoundary>
                <NavigationContainer>
                  <RootStacks />
                </NavigationContainer>
              </ErrorBoundary>
            </DailyProgressProvider>
          </GatingProvider>
        </SubscriptionProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
