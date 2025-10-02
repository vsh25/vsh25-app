import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';

export default function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}: { width?: number | string; height?: number; radius?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: theme.color.surface,
          borderWidth: 1,
          borderColor: theme.color.border,
        },
        // @ts-ignore
        style,
      ]}
    />
  );
}