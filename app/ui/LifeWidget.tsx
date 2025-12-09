import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useDailyProgress } from '../DailyProgress';

type Props = {
  bioCompleted?: boolean;
  pillCompleted?: boolean;
};

/**
 * Виджет "Продление жизни"
 * Показывает:
 *  - "Выполнено сегодня: X/2"
 *  - прогресс-линию
 *  - две таблетки: Биопрограмма / Таблетка
 *
 * Если пропы bioCompleted / pillCompleted не переданы,
 * берём данные из контекста useDailyProgress().
 */
export default function LifeWidget({ bioCompleted, pillCompleted }: Props) {
  const { isCompletedToday } = useDailyProgress();

  const bioDone =
    typeof bioCompleted === 'boolean' ? bioCompleted : isCompletedToday('bio');
  const pillDone =
    typeof pillCompleted === 'boolean' ? pillCompleted : isCompletedToday('pill');

  const total = 2;
  const doneCount = (bioDone ? 1 : 0) + (pillDone ? 1 : 0);
  const progress = total > 0 ? doneCount / total : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Продление жизни</Text>
      <Text style={styles.subtitle}>Выполнено сегодня: {doneCount}/{total}</Text>

      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.chipsRow}>
        <View style={[styles.chip, bioDone && styles.chipDone]}>
          <Text style={[styles.chipText, bioDone && styles.chipTextDone]}>
            {bioDone ? '✓ Биопрограмма' : 'Биопрограмма'}
          </Text>
        </View>

        <View style={[styles.chip, pillDone && styles.chipDone]}>
          <Text style={[styles.chipText, pillDone && styles.chipTextDone]}>
            {pillDone ? '✓ Таблетка' : 'Таблетка'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  bar: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 12,
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.color.primary,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F9FAFB',
  },
  chipDone: {
    borderColor: '#16A34A',
    backgroundColor: '#ECFDF3',
  },
  chipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  chipTextDone: {
    color: '#15803D',
  },
});
