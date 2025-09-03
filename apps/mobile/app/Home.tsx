import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDailyProgress } from './DailyProgress';

// Тестовые ссылки (позже подставишь свои HLS/MP4)
const BIO_URL  = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const PILL_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';

export default function Home({ navigation }: any) {
  const { isCompletedToday } = useDailyProgress(); // читаем статус "за сегодня"

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VSH25 — главная</Text>

      <Button
        title="Биопрограмма (10 мин)"
        onPress={() => navigation.navigate('Player', { id: 'bio', title: 'Биопрограмма', src: BIO_URL })}
        // ↑ помимо title/src передаём id='bio' — ключ активности
      />

      <View style={{ height: 12 }} />

      <Button
        title="Цифровая таблетка (30 сек)"
        onPress={() => navigation.navigate('Player', { id: 'pill', title: 'Цифровая таблетка', src: PILL_URL })}
      />

      {/* Строчка-индикатор: галочки, что уже засчитано сегодня */}
      <Text style={{ marginTop: 16 }}>
        За сегодня: Биопрограмма {isCompletedToday('bio') ? '✓' : '—'} · Таблетка {isCompletedToday('pill') ? '✓' : '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
});