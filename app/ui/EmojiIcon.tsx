import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../theme';

export default function EmojiIcon({ icon, size = 36 }: { icon: string; size?: number }) {
  const radius = size / 2;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: theme.color.surface,
        borderWidth: 1,
        borderColor: theme.color.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.5 }}>{icon}</Text>
    </View>
  );
}