import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import DateTimePicker, { AndroidEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UIButton from './ui/Button';
import { scheduleDailyReminder, cancelDailyReminders } from './notifications';
import { theme } from './theme';

const STORAGE_ENABLED = 'vsh25:reminder:enabled';
const STORAGE_TIME = 'vsh25:reminder:time'; // "HH:MM"

function parseTime(t: string | null): { hour: number; minute: number } {
  if (!t) return { hour: 21, minute: 0 }; // дефолт 21:00
  const [hh, mm] = t.split(':').map((n) => parseInt(n, 10));
  return {
    hour: Number.isFinite(hh) ? hh : 21,
    minute: Number.isFinite(mm) ? mm : 0,
  };
}
function fmt2(n: number) { return n.toString().padStart(2, '0'); }
function toTimeString(hour: number, minute: number) { return `${fmt2(hour)}:${fmt2(minute)}`; }

export default function Reminders() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [hour, setHour] = useState<number>(21);
  const [minute, setMinute] = useState<number>(0);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  // загрузка настроек
  useEffect(() => {
    (async () => {
      try {
        const [rawEnabled, rawTime] = await Promise.all([
          AsyncStorage.getItem(STORAGE_ENABLED),
          AsyncStorage.getItem(STORAGE_TIME),
        ]);
        if (rawEnabled !== null) setEnabled(rawEnabled === '1');
        const { hour: h, minute: m } = parseTime(rawTime);
        setHour(h); setMinute(m);
      } catch { /* ignore */ }
    })();
  }, []);

  // сохранить изменения локально
  async function persist(e: boolean, h: number, m: number) {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_ENABLED, e ? '1' : '0'),
      AsyncStorage.setItem(STORAGE_TIME, toTimeString(h, m)),
    ]);
  }

  // включение/выключение
  const toggleEnabled = async (next: boolean) => {
    setEnabled(next);
    await persist(next, hour, minute);
    if (next) {
      await cancelDailyReminders();
      await scheduleDailyReminder(hour, minute);
    } else {
      await cancelDailyReminders();
    }
  };

  // выбор времени
  const onChangeTime = async (_e: AndroidEvent, date?: Date) => {
    // Android: при отмене date будет undefined
    if (!date) { setShowPicker(false); return; }
    const h = date.getHours();
    const m = date.getMinutes();
    setHour(h); setMinute(m);
    await persist(enabled, h, m);
    setShowPicker(Platform.OS === 'ios'); // на iOS оставляем пикер, на Android скрываем

    // если включено — пересоздаём напоминание на новое время
    if (enabled) {
      await cancelDailyReminders();
      await scheduleDailyReminder(h, m);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Напоминания</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Ежедневное напоминание</Text>
        <Switch
          value={enabled}
          onValueChange={toggleEnabled}
          thumbColor={enabled ? theme.color.primary : '#fff'}
          trackColor={{ true: '#AFC7FF', false: '#CBD5E1' }}
        />
      </View>

      <View style={{ height: 12 }} />

      <Text style={styles.caption}>Текущее время: <Text style={styles.time}>{fmt2(hour)}:{fmt2(minute)}</Text></Text>

      <View style={{ height: 12 }} />

      <UIButton
        title="Изменить время"
        variant="outline"
        onPress={() => setShowPicker(true)}
        fullWidth
      />

      {showPicker && (
        <View style={{ marginTop: 8 }}>
          <DateTimePicker
            value={new Date(0, 0, 0, hour, minute)}
            mode="time"
            is24Hour
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeTime}
          />
        </View>
      )}

      <View style={{ height: 12 }} />

      <UIButton
        title="Отключить все напоминания"
        onPress={async () => {
          setEnabled(false);
          await persist(false, hour, minute);
          await cancelDailyReminders();
        }}
        fullWidth
      />

      <View style={{ height: 6 }} />
      <Text style={styles.helper}>
        Уведомления приходят ежедневно во выбранное время, даже если приложение закрыто.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.color.bg },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16, color: theme.color.text },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16, color: theme.color.text },
  caption: { color: theme.color.muted },
  time: { fontWeight: '700', color: theme.color.text },
  helper: { color: theme.color.muted, fontSize: 12 },
});