import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { useDailyProgress } from '../DailyProgress';

export default function LifeWidget() {
  const { isCompletedToday } = useDailyProgress();
  const bioDone  = isCompletedToday('bio');
  const pillDone = isCompletedToday('pill');

  const done = useMemo(() => (bioDone ? 1 : 0) + (pillDone ? 1 : 0), [bioDone, pillDone]);
  const percent = (done / 2) * 100;

  return (
    <LinearGradient
      colors={['#F7E3E7', '#E6EEFF']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.wrap}
    >
      <Text style={styles.title}>Продление жизни</Text>
      <Text style={styles.caption}>Выполнено сегодня: {done}/2</Text>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
      </View>

      <View style={styles.row}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{bioDone ? '✓' : '—'} Биопрограмма</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{pillDone ? '✓' : '—'} Таблетка</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.radius.l,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontFamily: theme.font.family.semibold,
    fontSize: 18,
    color: theme.color.text,
  },
  caption: {
    marginTop: 6,
    color: theme.color.muted,
    fontFamily: theme.font.family.regular,
    fontSize: 14,
  },
  barBg: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#ffffffaa',
    marginTop: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: theme.color.primary,
    borderRadius: 6,
  },
  row: { flexDirection: 'row', gap: 8, marginTop: 12 },
  pill: {
    backgroundColor: '#ffffffcc',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    fontFamily: theme.font.family.medium,
    color: theme.color.text,
    fontSize: 13,
  },
});