import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../theme';

export default function LifeWidget() {
  return (
    <View
      style={{
        padding: 16,
        borderRadius: theme.radius.l,
        backgroundColor: theme.color.surface,
        borderWidth: 1,
        borderColor: theme.color.border,
      }}
    >
      <Text style={{ fontWeight: '700', color: theme.color.text, marginBottom: 6 }}>
        Продление жизни
      </Text>
      <Text style={{ color: theme.color.muted }}>
        Ваше «заработанное время» появится здесь.
      </Text>
    </View>
  );
}