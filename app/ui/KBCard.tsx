import React from 'react';
import { View, Text } from 'react-native';
import Card from './Card';
import Chip from './Chip';
import { theme } from '../theme';

type Props = {
  title: string;
  tag?: string;
  onPress?: () => void;
};

export default function KBCard({ title, tag, onPress }: Props) {
  return (
    <Card onPress={onPress} style={{ padding: 14 }}>
      {tag ? (
        <View style={{ marginBottom: 8 }}>
          <Chip text={tag} muted />
        </View>
      ) : null}
      <Text style={{ fontSize: 16, fontWeight: '600', color: theme.color.text }}>
        {title}
      </Text>
    </Card>
  );
}