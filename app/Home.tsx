import React, { useLayoutEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import LifeWidget from './ui/LifeWidget';
import Card from './ui/Card';
import UIButton from './ui/Button';
import { useDailyProgress } from './DailyProgress';
import { useSession } from './session/Session';
import { useTranslation } from 'react-i18next';

// временные ссылки
const BIO_URL  = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const PILL_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';

export default function Home({ navigation }: any) {
  const { isCompletedToday } = useDailyProgress();
  const { t } = useTranslation();

  // --- уведомления ---

  // просим права; true — всё ок
  const ensureNotifPerms = async () => {
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      ({ status } = await Notifications.requestPermissionsAsync());
    }
    if (status !== 'granted') {
      Alert.alert('Уведомления выключены', 'Разреши уведомления в настройках системы.');
      return false;
    }
    return true;
  };

  // тест через 10 сек
  const testNotification10s = async () => {
    const ok = await ensureNotifPerms();
    if (!ok) return;

    await Notifications.scheduleNotificationAsync({
      content: { title: 'VSH25', body: 'Тестовое уведомление' },
      trigger: { seconds: 10 },
    });

    Alert.alert(
      'Запланировано',
      Platform.OS === 'android'
        ? 'Придёт через ~10 сек. Сверни приложение или погаси экран, чтобы увидеть баннер.'
        : 'Придёт через ~10 сек.'
    );
  };

  // ежедневно в 21:00
  const scheduleDaily2100 = async () => {
    const ok = await ensureNotifPerms();
    if (!ok) return;

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'VSH25',
        body: 'Время биопрограммы. 10 минут — и день засчитан.',
      },
      trigger: { hour: 21, minute: 0, repeats: true },
    });

    const list = await Notifications.getAllScheduledNotificationsAsync();
    Alert.alert('Готово', `Ежедневное напоминание в 21:00 включено. Всего запланировано: ${list.length}.`);
  };

  // удалить все
  const cancelDailyReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('Отключено', 'Ежедневные напоминания удалены.');
  };

  // header → кнопка Профиль
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <UIButton
          title={t('buttons.profile')}
          variant="ghost"
          size="s"
          onPress={() => navigation.navigate('Profile')}
          style={{ paddingHorizontal: 10, borderRadius: 14 }}
        />
      ),
    });
  }, [navigation, t]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>VSH25 — главная</Text>

      <LifeWidget />

      <Card
        title="Биопрограмма (10 минут)"
        subtitle="Ежедневная практика для активного долголетия"
        onPress={() => navigation.navigate('Player', { id: 'bio', title: 'Биопрограмма', src: BIO_URL })}
      />

      <View style={styles.gap12} />

      <Card
        title="Цифровая таблетка (30 сек)"
        subtitle="Быстрый эффект, когда нет времени"
        onPress={() => navigation.navigate('Player', { id: 'pill', title: 'Цифровая таблетка', src: PILL_URL })}
      />

      <View style={styles.gap16} />

      <UIButton title="Тест-уведомление (10 сек)" onPress={testNotification10s} />
      <View style={styles.gap12} />
      <UIButton title="Напоминание в 21:00" onPress={scheduleDaily2100} />
      <View style={styles.gap8} />
      <UIButton title="Отключить напоминания" variant="outline" onPress={cancelDailyReminders} />

      <View style={styles.gap16} />
      <Text style={styles.today}>
        За сегодня: Биопрограмма {isCompletedToday('bio') ? '✓' : '—'} · Таблетка {isCompletedToday('pill') ? '✓' : '—'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  gap8: { height: 8 },
  gap12: { height: 12 },
  gap16: { height: 16 },
  today: { marginTop: 16, color: '#64748B' },
});