import React from 'react';
import { View, Text } from 'react-native';
import Card from './Card';
import Chip from './Chip';
import { theme } from '../theme';
import Icon, { IconName } from './Icon';

type Props = {
  title: string;
  tag?: string;
  iconName?: IconName;
  onPress?: () => void;
};

export default function KBCard({ title, tag, iconName, onPress }: Props) {
  return (
    <Card onPress={onPress} style={{ padding: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {iconName ? (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#EEF2F7',
              borderWidth: 1,
              borderColor: theme.color.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={iconName} size={22} tint={theme.color.muted} />
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