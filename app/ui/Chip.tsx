import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../theme';

type Props = {
  text: string;
  active?: boolean;      // выделение (успех)
  muted?: boolean;       // приглушённый
};

export default function Chip({ text, active, muted }: Props) {
  const bg = active
    ? '#E6F6EA'                       // светло-зелёный фон для успеха
    : muted
    ? theme.color.surface
    : theme.color.bg;

  const border = active ? '#72D694' : theme.color.border;
  const color = active ? theme.color.success : theme.color.muted;

  return (
    <View
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
      }}
    >
      <Text style={{ color, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}