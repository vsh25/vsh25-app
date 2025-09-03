import React, { useRef, useLayoutEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useDailyProgress } from './DailyProgress';

type RouteParams = { id: string; title?: string; src: string };

export default function Player({ route, navigation }: { route: any; navigation: any }) {
  const { id, title = 'Player', src } = (route?.params || {}) as RouteParams;

  const { markCompletedToday } = useDailyProgress(); // функция отметить "сегодня просмотрено"

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const [percent, setPercent] = useState(0);
  const [completed, setCompleted] = useState(false);
  const videoRef = useRef<Video>(null);

  const onStatus = (st: any) => {
    if (!st?.isLoaded || !st.durationMillis) return;
    const p = Math.min(100, Math.round((st.positionMillis / st.durationMillis) * 100));
    setPercent(p);

    if (!completed && (st.didJustFinish || p >= 90)) {
      setCompleted(true);
      markCompletedToday(id); // ← отмечаем активность как выполненную сегодня
      console.log('[VSH25] completed:', { title, src, percent: p });
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

      <View style={{ position: 'absolute', left: 12, top: 12, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>{percent}% {completed ? '• засчитано ✓' : ''}</Text>
      </View>
    </View>
  );
}