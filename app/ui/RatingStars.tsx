// app/ui/RatingStars.tsx
// 5-звёздочный рейтинг.

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  value: number;                    // выбранная оценка 1..5
  onChange: (value: number) => void;
  disabled?: boolean;
};

export default function RatingStars({ value, onChange, disabled }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <Pressable
            key={star}
            onPress={() => !disabled && onChange(star)}
            style={styles.starWrapper}
            hitSlop={8}
          >
            <Text style={[styles.star, filled && styles.starFilled]}>
              {filled ? '★' : '☆'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starWrapper: {
    marginRight: 4,
  },
  star: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  starFilled: {
    color: '#FBBF24', // жёлтые звёзды
  },
});
