import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDailyProgress } from './DailyProgress';

// Собираем последние 14 дат (сегодня в конце)
function makeLast14Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

// ISO в формате YYYY-MM-DD (как в сторе)
function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function Calendar() {
  const { getDayStatus } = useDailyProgress();
  const days = useMemo(() => makeLast14Days(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Календарь — 14 дней</Text>

      <FlatList
        data={days}
        keyExtractor={(d) => toISO(d)}
        numColumns={4}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const iso = toISO(item);
          const day = item.getDate().toString().padStart(2, '0');
          const month = (item.getMonth() + 1).toString().padStart(2, '0');

          // Берём реальный статус из истории
          const status = getDayStatus(iso); // { bio?: true, pill?: true, rating?: number }
          const bioDone = Boolean(status?.bio);
          const pillDone = Boolean(status?.pill);

          // Визуальная подсветка: если что-то сделано — делаем ячейку чуть «сильнее»
          const doneSomething = bioDone || pillDone;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.cell, doneSomething && styles.cellDone]}
            >
              <Text style={styles.cellDay}>{day}.{month}</Text>
              <Text style={styles.cellStatus}>
                Био: {bioDone ? '✓' : '—'} · Таб: {pillDone ? '✓' : '—'}
              </Text>
              {status?.rating ? (
                <Text style={styles.cellRating}>Оценка: {status.rating}/5</Text>
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  cell: {
    flex: 1,
    minHeight: 80,
    borderRadius: 12,
    backgroundColor: '#F4F6F8',
    padding: 10,
    justifyContent: 'center',
  },
  cellDone: {
    backgroundColor: '#E8F3FF', // лёгкая подсветка «выполнено»
    borderWidth: 1,
    borderColor: '#2E6AF6',
  },
  cellDay: { fontSize: 16, fontWeight: '600' },
  cellStatus: { marginTop: 6, color: '#687076' },
  cellRating: { marginTop: 4, color: '#374151', fontSize: 12 },
});