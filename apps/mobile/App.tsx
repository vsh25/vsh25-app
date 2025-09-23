import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './app/Home';
import Player from './app/Player';
import { DailyProgressProvider } from './app/DailyProgress';

import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';

import { SessionProvider, useSession } from './app/session/Session';
import Login from './app/auth/Login';
import Otp from './app/auth/Otp';

import { useEffect } from 'react';
import { loadSavedLanguage } from './app/i18n/lang';

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
  if (initializing) return null; // здесь можно повесить splash

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
  // 1) Загружаем шрифты Rubik
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
    'Rubik-Medium': require('./assets/fonts/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('./assets/fonts/Rubik-SemiBold.ttf'),
    'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
  });
  if (!fontsLoaded) return null; // пока шрифты грузятся — ничего не рисуем

  // 2) Разрешения/канал уведомлений (Android)
  useEffect(() => {
    loadSavedLanguage();
    (async () => {
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
    <SessionProvider>
      <DailyProgressProvider>
        <RootStacks />
      </DailyProgressProvider>
    </SessionProvider>
  );
}