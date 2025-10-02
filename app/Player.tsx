import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useKeepAwake } from 'expo-keep-awake';
import UIButton from './ui/Button';
import { useDailyProgress } from './DailyProgress';
import { useRateVideo } from './services/hooks';
import { useTranslation } from 'react-i18next';
import { useSubscription } from './subscription/Subscription';
import { isPaywalled } from './flags/gating';

type RouteParams = { id: 'bio' | 'pill'; title?: string; src: string; minPercent?: number };

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Player({ route, navigation }: { route: any; navigation: any }) {
  const { id, title = 'Player', src, minPercent = 0.9 } = (route?.params || {}) as RouteParams;
  const videoRef = useRef<Video>(null);

  useKeepAwake();

  const { t } = useTranslation();
  const { markCompletedToday, setDayStatus, isCompletedToday } = useDailyProgress();
  const rateVideo = useRateVideo();
  const { active } = useSubscription();

  // прогресс
  const [percent, setPercent] = useState(0);
  const [completed, setCompleted] = useState<boolean>(isCompletedToday(id));

  // оверлеи
  const [showDone, setShowDone] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // ← скелетон до onReadyForDisplay

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  // защита paywall
  useEffect(() => {
    if (!active && isPaywalled(id)) {
      Alert.alert('Требуется подписка', 'Оформите подписку, чтобы смотреть это видео.', [
        { text: 'Ок', onPress: () => navigation.replace('Paywall') },
      ]);
    }
  }, [active, id, navigation]);

  const onStatus = (st: any) => {
    if (!st?.isLoaded || !st.durationMillis) return;
    const p = Math.min(100, Math.round((st.positionMillis / st.durationMillis) * 100));
    setPercent(p);

    if (!completed && (st.didJustFinish || p / 100 >= minPercent)) {
      setCompleted(true);
      markCompletedToday(id);
      setShowDone(true);
    }
  };

  const saveAndExit = async () => {
    try {
      if (rating) setDayStatus(todayISO(), { rating });
      if (rating) await rateVideo.mutateAsync({ id, rating });
      navigation.goBack();
    } catch (e: any) {
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
        onLoadStart={() => setLoading(true)}
        onReadyForDisplay={() => setLoading(false)}
        onPlaybackStatusUpdate={onStatus}
        onError={(e) => console.log('Video error', e)}
      />

      {/* скелетон-оверлей до готовности видео */}
      {loading && (
        <View style={styles.loaderBackdrop}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loaderText}>Загрузка…</Text>
        </View>
      )}

      {/* маленький оверлей прогресса слева сверху */}
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {percent}% {completed ? `• ${t('player.completed', 'Засчитано')} ✓` : ''}
        </Text>
      </View>

      {/* бейдж "Засчитано" справа сверху */}
      {completed && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>{t('player.completed', 'Засчитано')}</Text>
        </View>
      )}

      {/* экран “Завершено” с оценкой */}
      {showDone && (
        <View style={styles.doneBackdrop}>
          <View style={styles.doneCard}>
            <Text style={styles.doneTitle}>Сессия завершена</Text>
            <Text style={styles.doneCaption}>Оцените просмотр</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => setRating(n)} style={{ padding: 6 }}>
                  <Text style={[styles.star, { color: n <= (rating ?? 0) ? '#F59E0B' : '#CBD5E1' }]}>★</Text>
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
  loaderBackdrop: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  loaderText: { marginTop: 12, color: '#fff', fontWeight: '600' },

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

  completedBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#16A34A',
    borderRadius: 999,
  },
  completedText: { color: '#fff', fontWeight: '700' },

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