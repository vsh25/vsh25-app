// app/ui/ProgressSummary.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressData } from '../api/progress';
import { theme } from '../theme';

type Props = {
  data: ProgressData;
};

/**
 * Карточка общей статистики:
 * - заработанное время (перевод секунд в годы/дни/часы)
 * - прогресс за сегодня (из 10 минут)
 * - серия дней подряд
 */
export default function ProgressSummary({ data }: Props) {
  const earnedSeconds = data.earned_seconds ?? 0;
  const todaySeconds = data.today_seconds ?? 0;
  const streakDays = data.streak_days ?? 0;

  // Переводим общее время в годы / дни / часы
  const SECONDS_IN_DAY = 86400;
  const SECONDS_IN_HOUR = 3600;
  const SECONDS_IN_YEAR = 365.25 * SECONDS_IN_DAY;

  let remaining = earnedSeconds;
  const years = Math.floor(remaining / SECONDS_IN_YEAR);
  remaining -= years * SECONDS_IN_YEAR;

  const days = Math.floor(remaining / SECONDS_IN_DAY);
  remaining -= days * SECONDS_IN_DAY;

  const hours = Math.floor(remaining / SECONDS_IN_HOUR);

  // Сегодня: цель 10 минут
  const targetMinutes = 10;
  const todayMinutes = Math.round(todaySeconds / 60);
  const todayPercent = Math.max(
    0,
    Math.min(100, Math.round((todayMinutes / targetMinutes) * 100))
  );

  const formatTotal = () => {
    if (earnedSeconds <= 0) return '0 ч';

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} г`);
    if (days > 0) parts.push(`${days} д`);
    if (hours > 0) parts.push(`${hours} ч`);

    return parts.join(' ');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Заработано с VSH25</Text>
      <Text style={styles.total}>{formatTotal()}</Text>

      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Сегодня</Text>
        <Text style={styles.progressValue}>
          {todayMinutes} мин из {targetMinutes} ({todayPercent}%)
        </Text>
      </View>

      {/* Полоска прогресса за сегодня */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${todayPercent}%` }]} />
      </View>

      <Text style={styles.footer}>
        Серия: {streakDays} {plural(streakDays, ['день', 'дня', 'дней'])}
      </Text>
    </View>
  );
}

function plural(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.color.primary,
  },
  footer: {
    fontSize: 12,
    color: '#6B7280',
  },
});
