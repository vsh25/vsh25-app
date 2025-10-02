import React from 'react';
import { View, Text, Pressable, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';

type Props = {
  title?: string;
  subtitle?: string;
  left?: React.ReactNode;   // ← новый слот слева
  right?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function Card({ title, subtitle, left, right, children, onPress, style }: Props) {
  const Inner = (
    <View
      style={[
        {
          backgroundColor: theme.color.bg,
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
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {left ? <View style={{ marginRight: 12 }}>{left}</View> : null}

        <View style={{ flex: 1 }}>
          {(title || subtitle) && (
            <>
              {title && (
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.color.text }}>
                  {title}
                </Text>
              )}
              {subtitle && <Text style={{ marginTop: 4, color: theme.color.muted }}>{subtitle}</Text>}
            </>
          )}
          {children}
        </View>

        {right ? <View style={{ marginLeft: 8 }}>{right}</View> : null}
      </View>
    </View>
  );

  if (!onPress) return Inner;

  return (
    <Pressable onPress={onPress} android_ripple={{ color: '#00000014' }} style={{ borderRadius: theme.radius.l }}>
      {Inner}
    </Pressable>
  );
}