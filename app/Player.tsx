import React, { useRef, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import { useKeepAwake } from 'expo-keep-awake';
import UIButton from './ui/Button';
import { useDailyProgress } from './DailyProgress';
import { useTranslation } from 'react-i18next';
import { useSubscription } from './subscription/Subscription';
import { useGating } from './flags/gating';
import { toast } from './ui/toast';
import RatingStars from './ui/RatingStars';
import { sendRating } from './api/rating';

type RouteParams = {
  id: 'bio' | 'pill';
  title?: string;
  src: string;
  minPercent?: number;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Player({ route, navigation }: { route: any; navigation: any }) {
  const { id, title = 'Player', src, minPercent = 0.9 } = (route?.params || {}) as RouteParams;
  const videoRef = useRef<Video>(null);
  const [videoKey, setVideoKey] = useState(0);

  useKeepAwake();

  const { t } = useTranslation();
  const { markCompletedToday, setDayStatus, isCompletedToday } = useDailyProgress();
  const { active } = useSubscription();
  const { isPaywalled } = useGating();

  const previewSec = !active && isPaywalled(id) ? 15 : null;

  const [percent, setPercent] = useState(0);
  const [completed, setCompleted] = useState<boolean>(isCompletedToday(id));
  const [showDone, setShowDone] = useState(false);

  const [rating, setRating] = useState<number>(0);
  const [ratingSending, setRatingSending] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const onStatus = (st: any) => {
    if (!st?.isLoaded || !st.durationMillis) return;

    if (previewSec && st.positionMillis >= previewSec * 1000) {
      videoRef.current?.pauseAsync().catch(() => {});
      toast('Превью 15 c. Оформите подписку, чтобы смотреть дальше.');
      navigation.replace('Paywall');
      return;
    }

    const p = Math.min(100, Math.round((st.positionMillis / st.durationMillis) * 100));
    setPercent(p);

    if (!previewSec && !completed && (st.didJustFinish || p / 100 >= minPercent)) {
      setCompleted(true);
      markCompletedToday(id);
      setShowDone(true);
    }
  };

  const saveAndExit = async () => {
    try {
      if (rating > 0) {
        // сохраняем рейтинг локально в DailyProgress
        setDayStatus(todayISO(), { rating });

        // и отправляем на сервер (сейчас это мок через sendRating)
        setRatingSending(true);
        setRatingError(null);
        await sendRating({ contentId: id, score: rating });
      }
    } catch (e: any) {
      console.log('sendRating error:', e);
      setRatingError(e?.message || 'Не удалось отправить оценку');
    } finally {
      setRatingSending(false);
      navigation.goBack();
    }
  };

  const retry = () => {
    setErrorText(null);
    setLoading(true);
    setVideoKey((k) => k + 1); // пересоздаём Video
  };

  const openExternal = async () => {
    try {
      await WebBrowser.openBrowserAsync(src);
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Video
        key={videoKey}
        ref={videoRef}
        source={{ uri: src }}
        style={{ flex: 1 }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        onLoadStart={() => {
          setLoading(true);
          setErrorText(null);
        }}
        onReadyForDisplay={() => setLoading(false)}
        onPlaybackStatusUpdate={onStatus}
        onError={(e) => {
          setLoading(false);
          const msg =
            e?.error?.message ||
            e?.error?.toString?.() ||
            'Не удалось загрузить видео';
          setErrorText(msg);
          console.log('Video error:', e);
        }}
      />

      {/* лоадер */}
      {loading && !errorText && (
        <View style={styles.loaderBackdrop}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loaderText}>Загрузка…</Text>
        </View>
      )}

      {/* ошибка + действия */}
      {!!errorText && (
        <View style={styles.loaderBackdrop}>
          <Text style={[styles.loaderText, { marginBottom: 12 }]}>{errorText}</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <UIButton title="Повторить" onPress={retry} />
            <UIButton title="Открыть в браузере" variant="outline" onPress={openExternal} />
          </View>
        </View>
      )}

      {/* прогресс */}
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {percent}%{' '}
          {!previewSec && completed
            ? `• ${t('player.completed', 'Засчитано')} ✓`
            : ''}
        </Text>
      </View>

      {/* завершено + оценка */}
      {!previewSec && showDone && (
        <View style={styles.doneBackdrop}>
          <View style={styles.doneCard}>
            <Text style={styles.doneTitle}>Сессия завершена</Text>
            <Text style={styles.doneCaption}>Оцените просмотр</Text>

            <View style={styles.starsRow}>
              <RatingStars
                value={rating}
                onChange={setRating}
                disabled={ratingSending}
              />
            </View>

            {ratingError && (
              <Text style={styles.ratingError}>{ratingError}</Text>
            )}

            <UIButton
              title={ratingSending ? 'Сохраняем…' : 'Сохранить и выйти'}
              onPress={saveAndExit}
              disabled={ratingSending || rating === 0}
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
    padding: 24,
  },
  loaderText: {
    marginTop: 12,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },

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
  ratingError: {
    marginTop: 4,
    color: '#F97373',
    fontSize: 12,
    textAlign: 'center',
  },
});
