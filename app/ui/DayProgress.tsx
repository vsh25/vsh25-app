// app/ui/DayProgress.tsx
// Прогресс за выбранный день (биопрограмма + таблетка).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type Props = {
  bioCompleted: boolean;
  pillCompleted: boolean;
};

export default function DayProgress({ bioCompleted, pillCompleted }: Props) {
  const total = 2;
  const completed = (bioCompleted ? 1 : 0) + (pillCompleted ? 1 : 0);
  const percentage = (completed / total) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>За этот день просмотрено:</Text>

      <View style={styles.progressRow}>
        <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
      </View>

      {/* Легенда как на сайте */}
      <View style={styles.legendRow}>
        <View style={[styles.legendDot, { backgroundColor: theme.color.primary }]} />
        <Text style={styles.legendText}>Биопрограмма</Text>

        <View style={styles.legendSpacer} />

        <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
        <Text style={styles.legendText}>Цифровая таблетка</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.color.primary,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  legendSpacer: {
    width: 16,
  },
});
