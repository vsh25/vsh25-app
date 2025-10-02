import React, { useRef, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useKeepAwake } from 'expo-keep-awake';
import UIButton from './ui/Button';
import { useDailyProgress } from './DailyProgress';
import { useRateVideo } from './services/hooks';
import { useTranslation } from 'react-i18next';
import { useSubscription } from './subscription/Subscription';
import { isPaywalled } from './flags/gating';
import { toast } from './ui/toast';

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

  // soft-gate: если paywalled и нет подписки — даём 15с превью
  const previewSec = !active && isPaywalled(id) ? 15 : null;

  const [percent, setPercent] = useState(0);
  const [completed, setCompleted] = useState<boolean>(isCompletedToday(id));
  const [showDone, setShowDone] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewTriggered, setPreviewTriggered] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const onStatus = (st: any) => {
    if (!st?.isLoaded || !st.durationMillis) return;

    // превью: остановить на previewSec
    if (previewSec && !previewTriggered && st.positionMillis >= previewSec * 1000) {
      setPreviewTriggered(true);
      videoRef.current?.pauseAsync().catch(() => {});
      toast('Доступно 15 сек. превью. Оформите подписку, чтобы продолжить.');
      navigation.replace('Paywall');
      return;
    }

    const p = Math.min(100, Math.round((st.positionMillis / st.durationMillis) * 100));
    setPercent(p);

    // засчитываем только если это не превью
    if (!previewSec && !completed && (st.didJustFinish || p / 100 >= minPercent)) {
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
    } catch {
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
        onError={() => {
          setLoading(false);
          toast('Не удалось загрузить видео');
          navigation.goBack();
        }}
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
          {percent}% {(!previewSec && completed) ? `• ${t('player.completed', 'Засчитано')} ✓` : ''}
        </Text>
      </View>

      {/* экран “Завершено” с оценкой (только не превью) */}
      {!previewSec && showDone && (
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