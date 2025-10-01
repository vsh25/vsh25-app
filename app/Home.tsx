import React, { useLayoutEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as WebBrowser from 'expo-web-browser';

import LifeWidget from './ui/LifeWidget';
import Card from './ui/Card';
import UIButton from './ui/Button';
import { useDailyProgress } from './DailyProgress';
import { useTranslation } from 'react-i18next';
import { articles } from './content/articles';
import { useDailyVideos } from './hooks/useDailyVideos';

import { useSubscription } from './subscription/Subscription';
import { isPaywalled } from './flags/gating';

export default function Home({ navigation }: any) {
  const { isCompletedToday } = useDailyProgress();
  const { t } = useTranslation();
  const { bio, pill } = useDailyVideos();
  const { active } = useSubscription();

  // что закрыто по флагам (если подписки нет)
  const bioLocked  = isPaywalled('bio')  && !active;
  const pillLocked = isPaywalled('pill') && !active;

  // --- Уведомления ---

  const ensureNotifPerms = async () => {
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') ({ status } = await Notifications.requestPermissionsAsync());
    if (status !== 'granted') {
      Alert.alert('Уведомления выключены', 'Разреши уведомления в настройках системы.');
      return false;
    }
    return true;
  };

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

  const scheduleDaily2100 = async () => {
    const ok = await ensureNotifPerms();
    if (!ok) return;

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: 'VSH25', body: 'Время биопрограммы. 10 минут — и день засчитан.' },
      trigger: { hour: 21, minute: 0, repeats: true },
    });

    const list = await Notifications.getAllScheduledNotificationsAsync();
    Alert.alert('Готово', `Напоминание в 21:00 включено. Всего запланировано: ${list.length}.`);
  };

  const cancelDailyReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('Отключено', 'Ежедневные напоминания удалены.');
  };

  const openArticle = async (url: string) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) {
        Alert.alert('Статья не найдена', 'Ссылка пока заглушка. Обновим позже.');
        return;
      }
    } catch {
      // если HEAD недоступен — всё равно попробуем открыть
    }
    await WebBrowser.openBrowserAsync(
      url,
      Platform.select({
        ios:    { preferredBarTintColor: '#2B7EEB', preferredControlTintColor: '#FFFFFF' },
        android:{ toolbarColor: '#2B7EEB', showTitle: true },
        default: {},
      })
    );
  };

  // Кнопка «Профиль» в хедере
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
        title={bio.title}
        subtitle={bioLocked ? '🔒 Требует подписку' : 'Ежедневная практика для активного долголетия'}
        right={bioLocked ? <Text style={styles.lock}>🔒</Text> : null}
        onPress={() => (bioLocked ? navigation.navigate('Paywall') : navigation.navigate('Player', bio))}
      />

      <View style={styles.gap12} />

      <Card
        title={pill.title}
        subtitle={pillLocked ? '🔒 Требует подписку' : 'Быстрый эффект, когда нет времени'}
        right={pillLocked ? <Text style={styles.lock}>🔒</Text> : null}
        onPress={() => (pillLocked ? navigation.navigate('Paywall') : navigation.navigate('Player', pill))}
      />

      <View style={styles.gap16} />
      <UIButton title={t('paywall.title', 'Подписка')} onPress={() => navigation.navigate('Paywall')} />

      <View style={styles.gap16} />
      <UIButton title="Тест-уведомление (10 сек)" onPress={testNotification10s} />
      <View style={styles.gap12} />
      <UIButton title="Напоминание в 21:00" onPress={scheduleDaily2100} />
      <View style={styles.gap8} />
      <UIButton title="Отключить напоминания" variant="outline" onPress={cancelDailyReminders} />

      <View style={styles.gap16} />
      <Text style={styles.sectionTitle}>{t('kb.title', 'База знаний')}</Text>

      {articles.map((a) => (
        <Card key={a.id} title={a.title} subtitle={a.tag} onPress={() => openArticle(a.url)} />
      ))}

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
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  lock: { fontSize: 16, marginLeft: 8, color: '#64748B' },
  gap8: { height: 8 },
  gap12: { height: 12 },
  gap16: { height: 16 },
  today: { marginTop: 16, color: '#64748B' },
});