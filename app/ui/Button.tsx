import React from 'react';
import {
  Pressable,
  Text,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  View,
} from 'react-native';
import { theme } from '../theme';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 's' | 'm' | 'l';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

const paddingsBySize: Record<Size, { py: number; px: number; font: number }> = {
  s: { py: 6, px: 12, font: 13 },
  m: { py: 10, px: 16, font: 15 },
  l: { py: 14, px: 18, font: 17 },
};

export default function UIButton({
  title,
  onPress,
  variant = 'primary',
  size = 'm',
  disabled,
  loading,
  fullWidth,
  style,
}: Props) {
  const sz = paddingsBySize[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      android_ripple={variant !== 'ghost' ? { color: '#00000014' } : undefined}
      style={({ pressed }) => [
        {
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          borderRadius: theme.radius.l,
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: sz.py,
          paddingHorizontal: sz.px,
          opacity: isDisabled ? 0.6 : 1,

          // background
          backgroundColor:
            variant === 'primary'
              ? pressed
                ? theme.color.primaryAlt
                : theme.color.primary
              : variant === 'outline'
              ? theme.color.bg
              : 'transparent',

          // border
          borderColor:
            variant === 'outline' ? theme.color.border : 'transparent',

          // shadow для primary
          ...(variant === 'primary' ? theme.shadow.card : {}),
        },
        style as any,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variant === 'ghost' ? theme.color.text : '#fff'} />
        ) : null}
        <Text
          style={{
            fontSize: sz.font,
            fontWeight: '600',
            color:
              variant === 'primary'
                ? '#fff'
                : variant === 'outline'
                ? theme.color.text
                : theme.color.text,
          }}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}