import React, { useRef, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import UIButton from './ui/Button';
import { useDailyProgress } from './DailyProgress';
import { useRateVideo } from './services/hooks'; // ← добавили

type RouteParams = { id: 'bio' | 'pill'; title?: string; src: string };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Player({ route, navigation }: { route: any; navigation: any }) {
  const { id, title = 'Player', src } = (route?.params || {}) as RouteParams;
  const videoRef = useRef<Video>(null);

  // прогресс
  const [percent, setPercent] = useState(0);
  const [completed, setCompleted] = useState(false);

  // “Завершено” + рейтинг
  const [showDone, setShowDone] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const { markCompletedToday, setDayStatus } = useDailyProgress();
  const rateVideo = useRateVideo(); // ← мутатор API (пока в MOCK-режиме просто «успех»)

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const onStatus = (st: any) => {
    if (!st?.isLoaded || !st.durationMillis) return;

    const p = Math.min(100, Math.round((st.positionMillis / st.durationMillis) * 100));
    setPercent(p);

    // засчитываем один раз
    if (!completed && (st.didJustFinish || p >= 90)) {
      setCompleted(true);
      markCompletedToday(id);           // ✓ на сегодня (локально)
      setShowDone(true);                // открыть оверлей “Завершено”
    }
  };

  const saveAndExit = async () => {
    try {
      // 1) локально сохраняем оценку в историю за сегодня (чтобы календарь сразу увидел)
      if (rating) setDayStatus(todayISO(), { rating });

      // 2) отправляем оценку на API (в MOCK-режиме вернётся успех; позже включим реальный бэк)
      if (rating) await rateVideo.mutateAsync({ id, rating });

      navigation.goBack();
    } catch (e: any) {
      // не блокируем выход, просто сообщим
      Alert.alert('Не удалось отправить оценку', e?.message ?? 'Попробуйте позже');
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Video
        ref={videoRef}
        source={{ uri: src }}
        style={{ flex: 1 }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={onStatus}
        onError={(e) => console.log('Video error', e)}
      />

      {/* маленький оверлей прогресса */}
      <View style={styles.progress}>
        <Text style={styles.progressText}>{percent}% {completed ? '• засчитано ✓' : ''}</Text>
      </View>

      {/* экран “Завершено” */}
      {showDone && (
        <View style={styles.doneBackdrop}>
          <View style={styles.doneCard}>
            <Text style={styles.doneTitle}>Сессия завершена</Text>
            <Text style={styles.doneCaption}>Оцените просмотр</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => setRating(n)} style={{ padding: 6 }}>
                  <Text style={[styles.star, { color: n <= (rating ?? 0) ? '#F59E0B' : '#CBD5E1' }]}>
                    ★
                  </Text>
                </Pressable>
              ))}
            </View>

            <UIButton
              title={rateVideo.isPending ? 'Сохраняем…' : 'Сохранить и выйти'}
              onPress={saveAndExit}
              disabled={!rating || rateVideo.isPending}
              fullWidth
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressText: { color: '#fff', fontWeight: '600' },

  doneBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  doneCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  doneTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4, color: '#0F172A' },
  doneCaption: { color: '#64748B', marginBottom: 8 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 6 },
  star: { fontSize: 28, lineHeight: 28 },
});