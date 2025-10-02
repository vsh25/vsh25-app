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
import { H2 } from './ui/Typography';
import EmojiIcon from './ui/EmojiIcon';
import KBCard from './ui/KBCard';
import KBSkeleton from './ui/KBSkeleton';

export default function Home({ navigation }: any) {
  const { isCompletedToday } = useDailyProgress();
  const { t } = useTranslation();
  const { bio, pill } = useDailyVideos();
  const { active } = useSubscription();

  const bioLocked  = isPaywalled('bio')  && !active;
  const pillLocked = isPaywalled('pill') && !active;

  // Включить/проверить права на уведомления
  const ensureNotifPerms = async () => {
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') ({ status } = await Notifications.requestPermissionsAsync());
    if (status !== 'granted') {
      Alert.alert('Уведомления выключены', 'Разреши уведомления в настройках системы.');
      return false;
    }
    return true;
  };

  // Тест-уведомление
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

  // Ежедневное напоминание
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

  // Открытие статьи
  const openArticle = async (url: string) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) {
        Alert.alert('Статья не найдена', 'Ссылка пока заглушка. Обновим позже.');
        return;
      }
    } catch {/* ignore */}
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

  // Флаг загрузки для «Базы знаний» (пока мок)
  const kbLoading = false;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <H2>VSH25 — главная</H2>

      <LifeWidget />

      {/* Биопрограмма */}
      <Card
        left={<EmojiIcon icon="🧬" />}
        title={bio.title}
        subtitle={bioLocked ? '🔒 Требует подписку' : 'Ежедневная практика для активного долголетия'}
        right={bioLocked ? <Text style={styles.lock}>🔒</Text> : null}
        onPress={() => (bioLocked ? navigation.navigate('Paywall') : navigation.navigate('Player', bio))}
      />

      <View style={styles.gap12} />

      {/* Цифровая таблетка */}
      <Card
        left={<EmojiIcon icon="💊" />}
        title={pill.title}
        subtitle={pillLocked ? '🔒 Требует подписку' : 'Быстрый эффект, когда нет времени'}
        right={pillLocked ? <Text style={styles.lock}>🔒</Text> : null}
        onPress={() => (pillLocked ? navigation.navigate('Paywall') : navigation.navigate('Player', pill))}
      />

      <View style={styles.gap16} />

      {/* CTA Подписка */}
      <UIButton
        title={t('paywall.title', 'Подписка')}
        onPress={() => navigation.navigate('Paywall')}
        fullWidth
      />

      <View style={styles.gap16} />

      {/* Кнопки уведомлений */}
      <UIButton title="Тест-уведомление (10 сек)" onPress={testNotification10s} />
      <View style={styles.gap12} />
      <UIButton title="Напоминание в 21:00" onPress={scheduleDaily2100} />
      <View style={styles.gap8} />
      <UIButton title="Отключить напоминания" variant="outline" onPress={cancelDailyReminders} />

      <View style={styles.gap16} />

      {/* Заголовок секции «База знаний» с иконкой */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 20 }}>📚</Text>
        <H2 style={{ marginBottom: 0 }}>{t('kb.title', 'База знаний')}</H2>
      </View>

      {/* Скелетон или список статей */}
      {kbLoading ? (
        <KBSkeleton />
      ) : (
        articles.map((a) => (
          <KBCard
            key={a.id}
            title={a.title}
            tag={a.tag}
            icon={a.icon}
            onPress={() => openArticle(a.url)}
          />
        ))
      )}

      <View style={styles.gap16} />

      {/* Статус за сегодня */}
      <Text style={styles.today}>
        За сегодня: Биопрограмма {isCompletedToday('bio') ? '✓' : '—'} · Таблетка {isCompletedToday('pill') ? '✓' : '—'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 32 },
  lock: { fontSize: 16, marginLeft: 8, color: '#64748B' },
  gap8: { height: 8 },
  gap12: { height: 12 },
  gap16: { height: 16 },
  today: { marginTop: 16, color: '#64748B' },
});