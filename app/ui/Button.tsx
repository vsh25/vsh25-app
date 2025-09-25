import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { theme } from '../theme';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 's' | 'm' | 'l';

type Props = {
  title?: string;                 // текст кнопки (альтернатива children)
  children?: React.ReactNode;     // можно передать свой JSX вместо title
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;            // тянуться на всю ширину
  style?: ViewStyle | ViewStyle[];// дополнительный стиль-обёртка
};

export default function Button({
  title,
  children,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  size = 'm',
  fullWidth,
  style,
}: Props) {
  // Цвета и размеры по токенам
  const bg =
    variant === 'primary' ? theme.color.primary :
    variant === 'outline' ? 'transparent' : 'transparent';

  const borderColor =
    variant === 'outline' ? theme.color.border : 'transparent';

  const textColor =
    variant === 'primary' ? '#FFFFFF' :
    variant === 'outline' ? theme.color.text : theme.color.text;

  const height = size === 's' ? 36 : size === 'l' ? 48 : 44;
  const paddingH = size === 's' ? theme.space.m : size === 'l' ? theme.space.l : theme.space.m;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { height, paddingHorizontal: paddingH, borderRadius: theme.radius.m },
        { backgroundColor: bg, borderColor, borderWidth: variant === 'outline' ? 1 : 0 },
        fullWidth && { alignSelf: 'stretch' },
        (disabled || loading) && { opacity: 0.6 },
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}
      android_ripple={{ color: '#00000014' }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: textColor, fontSize: size === 's' ? theme.font.size.s : size === 'l' ? theme.font.size.l : theme.font.size.m },
          ]}
          numberOfLines={1}
        >
          {children ?? title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 120,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // лёгкая тень для iOS (Android даёт ripple)
    ...theme.shadow.card,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  text: {
    fontFamily: theme.font.family.bold,
    fontWeight: '600',
  },
});