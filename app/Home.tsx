import React, {
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  Pressable,
  RefreshControl,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as WebBrowser from 'expo-web-browser';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

import { getProgress, ProgressData } from './api/progress';
import { getCalendar14d, CalendarDay } from './api/calendar';

import Icon from './ui/Icon';
import { theme } from './theme';

import LifeWidget from './ui/LifeWidget';
import Card from './ui/Card';
import UIButton from './ui/Button';
import { useDailyProgress } from './DailyProgress';
import { useTranslation } from 'react-i18next';
import { articles } from './content/articles';
import { useDailyVideos } from './hooks/useDailyVideos';

import { useSubscription } from './subscription/Subscription';
import { useGating } from './flags/gating';
import { H2 } from './ui/Typography';
import KBCard from './ui/KBCard';
import KBSkeleton from './ui/KBSkeleton';
import { useFocusEffect } from '@react-navigation/native';
import { toast } from './ui/toast';
import HomeHero from './ui/HomeHero';
import CalendarStrip from './ui/CalendarStrip';
import DayProgress from './ui/DayProgress';
import ProgressSummary from './ui/ProgressSummary';

export default function Home({ navigation }: any) {
  const scrollRef = useRef<ScrollView>(null);
  const kbAnchorY = useRef(0);

  const { isCompletedToday } = useDailyProgress();
  const { t } = useTranslation();
  const { bio, pill } = useDailyVideos();
  const { active } = useSubscription();
  const gating = useGating();

  const bioLocked = gating.isPaywalled('bio') && !active;
  const pillLocked = gating.isPaywalled('pill') && !active;
  const bioDoneToday = isCompletedToday('bio');
  const pillDoneToday = isCompletedToday('pill');

  const apiBase = (Constants.expoConfig?.extra as any)?.apiBaseUrl;

  // CTA «Подписка»
  const [paywallLoading, setPaywallLoading] = useState(false);
  const openPaywall = () => {
    setPaywallLoading(true);
    navigation.navigate('Paywall');
  };

  // pull-to-refresh + скелетон для KB
  const [kbLoading, setKbLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setKbLoading(true);
    setTimeout(() => {
      setKbLoading(false);
      setRefreshing(false);
      toast('Список обновлён');
    }, 800);
  };

  // прогресс из API
  const [debugProgress, setDebugProgress] = useState<ProgressData | null>(null);
  // календарь 14 дней
  const [calendarRaw, setCalendarRaw] = useState<CalendarDay[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    getProgress()
      .then((data) => {
        setDebugProgress(data);
        console.log('Progress from API:', data);
      })
      .catch((err) => {
        console.warn('Failed to load progress', err);
      });
  }, []);

  useEffect(() => {
    getCalendar14d()
      .then((days) => {
        setCalendarRaw(days);
        console.log('Calendar from API:', days);

        const todayStr = new Date().toISOString().slice(0, 10);
        const hasToday = days.some((d) => d.date === todayStr);
        setSelectedDate(hasToday ? todayStr : days[days.length - 1]?.date);
      })
      .catch((err) => {
        console.warn('Failed to load calendar', err);
      });
  }, []);

  // патчим календарь: сегодняшний день берём из useDailyProgress
  const todayStr = new Date().toISOString().slice(0, 10);
  const calendar: CalendarDay[] | null = calendarRaw
    ? calendarRaw.map((d) =>
        d.date === todayStr
          ? {
              ...d,
              bioCompleted: bioDoneToday,
              pillCompleted: pillDoneToday,
            }
          : d
      )
    : null;

  // выбранный день и форматтер даты
  const selectedDay =
    calendar && selectedDate
      ? calendar.find((d) => d.date === selectedDate)
      : null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    });
  };

  // при возврате: скролл к началу + снять лоадер CTA
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      setPaywallLoading(false);
    }, [])
  );

  // toast при активации подписки (переход false -> true)
  const prevActive = useRef(active);
  useEffect(() => {
    if (prevActive.current === false && active === true) {
      toast('Подписка активирована');
    }
    prevActive.current = active;
  }, [active]);

  // toast при изменении гейтинга
  const firstGating = useRef(true);
  useEffect(() => {
    if (firstGating.current) {
      firstGating.current = false;
      return;
    }
    toast('Настройки доступа обновлены');
  }, [gating.mode.bio, gating.mode.pill, gating.mode.kb]);

  // уведомления …
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
        ? 'Придёт через ~10 сек. Сверни приложение…'
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

    Alert.alert('Готово', 'Ежедневное напоминание в 21:00 включено.');
  };

  const cancelDailyReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('Отключено', 'Ежедневные напоминания удалены.');
  };

  // открыть статью …
  const openArticle = async (url: string) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) {
        Alert.alert('Статья не найдена', 'Ссылка пока заглушка.');
        return;
      }
    } catch {}
    await WebBrowser.openBrowserAsync(
      url,
      Platform.select({
        ios: { preferredBarTintColor: '#2B7EEB', preferredControlTintColor: '#FFFFFF' },
        android: { toolbarColor: '#2B7EEB', showTitle: true },
        default: {},
      })
    );
  };

  // кнопка «Профиль» в хедере
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

  const DoneBadge = () => (
    <View style={styles.doneBadge}>
      <Text style={styles.doneBadgeText}>✓ Сегодня</Text>
    </View>
  );

  // перейти сразу в Bio
  const goBio = () => {
    if (bioLocked) return navigation.navigate('Paywall');
    navigation.navigate('Player', bio);
  };

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#2B7EEB"
        />
      }
    >
      {/* HERO по Luma */}
      <HomeHero
        title="VSH25 — продление жизни"
        subtitle="Ежедневные короткие практики: Биопрограмма и Цифровая таблетка"
        onPrimary={goBio}
        onSecondary={openPaywall}
        primaryText={bioLocked ? 'Оформить подписку' : 'Смотреть Биопрограмму'}
        secondaryText="Подписка"
      />

      <LifeWidget />

      {/* Карточка общей статистики из /progress */}
      {debugProgress && <ProgressSummary data={debugProgress} />}

      {/* Биопрограмма */}
      <Card
        left={<Icon name="bio" size={36} tint={theme.color.primary} />}
        title={bio.title}
        subtitle={
          bioLocked ? '🔒 Требует подписку' : 'Ежедневная практика для активного долголетия'
        }
        right={bioLocked ? <Text style={styles.lock}>🔒</Text> : bioDoneToday ? <DoneBadge /> : null}
        onPress={goBio}
      />

      <View style={styles.gap12} />

      {/* Цифровая таблетка */}
      <Card
        left={<Icon name="pill" size={36} tint={theme.color.primary} />}
        title={pill.title}
        subtitle={pillLocked ? '🔒 Требует подписку' : 'Быстрый эффект, когда нет времени'}
        right={
          pillLocked ? <Text style={styles.lock}>🔒</Text> : pillDoneToday ? <DoneBadge /> : null
        }
        onPress={() =>
          pillLocked ? navigation.navigate('Paywall') : navigation.navigate('Player', pill)
        }
      />

      {/* CTA: Подписка (с лоадером) */}
      <View style={styles.sectionGap} />
      <UIButton
        title={t('paywall.title', 'Подписка')}
        onPress={openPaywall}
        loading={paywallLoading}
        fullWidth
      />

      {/* блок уведомлений */}
      <View style={styles.sectionGap} />
      <UIButton title="Тест-уведомление (10 сек)" onPress={testNotification10s} />
      <View style={styles.gap12} />
      <UIButton title="Напоминание в 21:00" onPress={scheduleDaily2100} />
      <View style={styles.gap8} />
      <UIButton
        title="Отключить напоминания"
        variant="outline"
        onPress={cancelDailyReminders}
        fullWidth
      />

      {/* маркер начала секции KB для скролла */}
      <View
        onLayout={(e) => {
          kbAnchorY.current = e.nativeEvent.layout.y;
        }}
      />

      {/* «База знаний» */}
      <View style={styles.sectionGap} />
      <Pressable
        onPress={() => scrollRef.current?.scrollTo({ y: kbAnchorY.current, animated: true })}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        hitSlop={8}
      >
        <Icon name="book" size={22} tint={theme.color.muted} />
        <H2 style={{ marginBottom: 0 }}>{t('kb.title', 'Knowledge base')}</H2>
      </Pressable>

      {kbLoading ? (
        <KBSkeleton />
      ) : (
        articles.map((a) => (
          <KBCard
            key={a.id}
            title={a.title}
            tag={a.tag}
            iconName={a.iconName}
            onPress={() => openArticle(a.url)}
          />
        ))
      )}

      {/* статус за сегодня */}
      <View style={styles.sectionGap} />
      <Text style={styles.today}>
        За сегодня: Биопрограмма {bioDoneToday ? '✓' : '—'} · Таблетка {pillDoneToday ? '✓' : '—'}
      </Text>

      {/* Календарь 14 дней + выбранный день */}
      {calendar && selectedDate && (
        <>
          <CalendarStrip
            days={calendar}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {selectedDay && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.selectedDateText}>
                {formatDate(selectedDay.date)}
              </Text>
              <Text style={styles.selectedDayStatus}>
                Биопрограмма {selectedDay.bioCompleted ? '✓' : '—'} · Таблетка{' '}
                {selectedDay.pillCompleted ? '✓' : '—'}
              </Text>

              <DayProgress
                bioCompleted={selectedDay.bioCompleted}
                pillCompleted={selectedDay.pillCompleted}
              />
            </View>
          )}
        </>
      )}

      <View style={styles.sectionGap} />

      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
          v{Application.nativeApplicationVersion} ({Application.nativeBuildVersion})
        </Text>
      </View>

      {/* временный вывод apiBase для проверки */}
      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
          API: {String(apiBase)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 32 },
  lock: { fontSize: 16, marginLeft: 8, color: '#64748B' },
  doneBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#16A34A',
    borderRadius: 999,
  },
  doneBadgeText: { color: '#fff', fontWeight: '700' },
  gap8: { height: 8 },
  gap12: { height: 12 },
  sectionGap: { height: 20 },
  today: { color: '#64748B' },
  selectedDateText: {
    color: '#4B5563',
    fontSize: 12,
    marginBottom: 2,
  },
  selectedDayStatus: {
    color: '#6B7280',
    fontSize: 12,
  },
});
