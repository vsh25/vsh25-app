import React from 'react';
import { View, Text, Pressable, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';

type Props = {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function Card({ title, subtitle, right, children, onPress, style }: Props) {
  const Body = (
    <View
      style={[
        {
          backgroundColor: theme.color.bg,       // поверхность карточки
          borderRadius: theme.radius.l,
          borderWidth: 1,
          borderColor: theme.color.border,
          padding: 16,
          ...theme.shadow.card,
        },
        // @ts-ignore
        style,
      ]}
    >
      {(title || subtitle) && (
        <View style={{ marginBottom: children ? 8 : 0, flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            {title && (
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.color.text }}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={{ marginTop: 4, color: theme.color.muted }}>
                {subtitle}
              </Text>
            )}
          </View>
          {right ? <View style={{ marginLeft: 8 }}>{right}</View> : null}
        </View>
      )}
      {children}
    </View>
  );

  if (!onPress) return Body;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: '#0000000f', borderless: false }}
      style={{ borderRadius: theme.radius.l }}
    >
      {Body}
    </Pressable>
  );
}