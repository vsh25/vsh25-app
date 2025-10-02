import React from 'react';
import { View, Text } from 'react-native';
import Card from './Card';
import Chip from './Chip';
import { theme } from '../theme';

type Props = {
  title: string;
  tag?: string;
  icon?: string;          // эмодзи, напр. "🧠"
  onPress?: () => void;
};

export default function KBCard({ title, tag, icon, onPress }: Props) {
  return (
    <Card onPress={onPress} style={{ padding: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {/* Превью-иконка (эмодзи в кружке) */}
        {icon ? (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.color.surface,
              borderWidth: 1,
              borderColor: theme.color.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18 }}>{icon}</Text>
          </View>
        ) : null}

        <View style={{ flex: 1 }}>
          {tag ? (
            <View style={{ marginBottom: 6 }}>
              <Chip text={tag} muted />
            </View>
          ) : null}
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.color.text }}>
            {title}
          </Text>
        </View>
      </View>
    </Card>
  );
}