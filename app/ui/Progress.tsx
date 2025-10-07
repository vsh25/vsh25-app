import React from 'react';
import { View } from 'react-native';
import { theme } from '../theme';

type Props = {
  value: number;          // 0..1
  height?: number;        // высота трека
  rounded?: boolean;      // скругление
};

export default function Progress({ value, height = 8, rounded = true }: Props) {
  const pct = Math.max(0, Math.min(1, value));
  const radius = rounded ? height / 2 : 0;

  return (
    <View
      style={{
        height,
        width: '100%',
        backgroundColor: theme.color.surface,
        borderWidth: 1,
        borderColor: theme.color.border,
        borderRadius: radius,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: '100%',
          width: `${pct * 100}%`,
          backgroundColor: theme.color.primary,
        }}
      />
    </View>
  );
}