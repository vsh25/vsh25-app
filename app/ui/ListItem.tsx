import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../theme';

type Props = { text: string };

export default function ListItem({ text }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: theme.color.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✓</Text>
      </View>
      <Text style={{ color: theme.color.text }}>{text}</Text>
    </View>
  );
}