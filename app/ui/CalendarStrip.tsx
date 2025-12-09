// app/ui/CalendarStrip.tsx
// Календарь-лента на 14 дней с выбором дня.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { CalendarDay } from '../api/calendar';
import { theme } from '../theme';

type Props = {
  days: CalendarDay[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export default function CalendarStrip({ days, selectedDate, onSelectDate }: Props) {
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Последние 14 дней</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {days.map((day) => {
          const isToday = day.date === todayStr;
          const isSelected = day.date === selectedDate;
          const anyCompleted = day.bioCompleted || day.pillCompleted;

          const dayNum = day.date.slice(8, 10); // "03" и т.п.

          return (
            <Pressable
              key={day.date}
              style={styles.item}
              onPress={() => onSelectDate(day.date)}
              hitSlop={8}
            >
              <View
                style={[
                  styles.dot,
                  anyCompleted && styles.dotCompleted,
                  isToday && styles.dotToday,
                  isSelected && styles.dotSelected,
                ]}
              >
                <Text style={styles.dayText}>{dayNum}</Text>
              </View>

              <View style={styles.flagsRow}>
                <View
                  style={[
                    styles.flag,
                    day.bioCompleted && styles.flagOn,
                  ]}
                >
                  <Text style={styles.flagText}>B</Text>
                </View>
                <View
                  style={[
                    styles.flag,
                    day.pillCompleted && styles.flagOn,
                  ]}
                >
                  <Text style={styles.flagText}>T</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const SIZE = 32;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 8,
  },
  row: {
    paddingVertical: 4,
  },
  item: {
    alignItems: 'center',
    marginRight: 8,
  },
  dot: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    borderColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  dotCompleted: {
    backgroundColor: theme.color.primary,
    borderColor: theme.color.primary,
  },
  // сегодня — жёлтая обводка
  dotToday: {
    borderWidth: 2,
    borderColor: '#FBBF24',
  },
  // выбранный день — белая обводка
  dotSelected: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  dayText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },
  flagsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  flag: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
    backgroundColor: '#020617',
  },
  flagOn: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  flagText: {
    color: '#F9FAFB',
    fontSize: 8,
    fontWeight: '700',
  },
});
