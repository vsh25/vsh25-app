import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './app/Home';
import Player from './app/Player';
import { DailyProgressProvider } from './app/DailyProgress';

import * as Notifications from 'expo-notifications';
import { SessionProvider, useSession } from './app/session/Session'; // ← ЕДИНСТВЕННЫЙ импорт
import Login from './app/auth/Login';
import Otp from './app/auth/Otp';

// Показывать уведомления даже в форграунде
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

function RootStacks() {
  const { token, initializing } = useSession();
  if (initializing) return null; // здесь можно повесить Splash

  return (
    <NavigationContainer>
      {token ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ title: 'VSH25' }} />
          <Stack.Screen name="Player" component={Player} options={{ title: 'Player' }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{ title: 'Вход' }} />
          <Stack.Screen name="Otp" component={Otp} options={{ title: 'Подтверждение' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  // Разрешения/канал уведомлений (Android)
  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    })();
  }, []);

  return (
    <SessionProvider>
      <DailyProgressProvider>
        <RootStacks />
      </DailyProgressProvider>
    </SessionProvider>
  );
}