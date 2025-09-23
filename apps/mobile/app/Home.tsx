import React, { useLayoutEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import LifeWidget from './ui/LifeWidget';
import Card from './ui/Card';
import UIButton from './ui/Button';
import { useDailyProgress } from './DailyProgress';

// временные ссылки на видео (позже подключим useDailyVideos из services/hooks)
const BIO_URL  = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const PILL_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';

export default function Home({ navigation }: any) {
  const { t } = useTranslation();
  const { isCompletedToday } = useDailyProgress();

  // кнопка "Профиль" в заголовке
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
      <Text style={styles.title}>{t('home.title')}</Text>

      {/* Виджет "Продление жизни" */}
      <LifeWidget />

      {/* Карточка: Биопрограмма */}
      <Card
        title="Биопрограмма (10 минут)"
        subtitle="Ежедневная практика для активного долголетия"
        onPress={() =>
          navigation.navigate('Player', { id: 'bio', title: 'Биопрограмма', src: BIO_URL })
        }
      />

      <View style={styles.gap12} />

      {/* Карточка: Таблетка */}
      <Card
        title="Цифровая таблетка (30 сек)"
        subtitle="Быстрый эффект, когда нет времени"
        onPress={() =>
          navigation.navigate('Player', { id: 'pill', title: 'Цифровая таблетка', src: PILL_URL })
        }
      />

      <View style={styles.gap16} />

      {/* Навигация на календарь */}
      <UIButton
        title={t('buttons.calendar14')}
        onPress={() => navigation.navigate('Calendar')}
        fullWidth
      />

      {/* Итог за сегодня */}
      <Text style={styles.today}>
        За сегодня: Биопрограмма {isCompletedToday('bio') ? '✓' : '—'} · Таблетка {isCompletedToday('pill') ? '✓' : '—'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  gap12: { height: 12 },
  gap16: { height: 16 },
  today: { marginTop: 16, color: '#64748B' },
});