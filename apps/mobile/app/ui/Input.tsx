import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { theme } from '../theme';

type Props = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  fullWidth?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
};

export default function Input({
  label,
  helperText,
  error,
  fullWidth,
  containerStyle,
  style,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={[fullWidth && { alignSelf: 'stretch' }, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        {...rest}
        onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
        placeholderTextColor={theme.color.muted}
        style={[
          styles.input,
          {
            borderColor: hasError ? theme.color.danger : focused ? theme.color.primary : theme.color.border,
            backgroundColor: '#fff',
          },
          style,
        ]}
      />

      {hasError ? (
        <Text style={styles.error}>{typeof error === 'string' ? error : 'Ошибка'}</Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    color: theme.color.text,
    fontSize: theme.font.size.s,
    fontFamily: theme.font.family.medium,
    fontWeight: '600',
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: theme.radius.m,
    borderWidth: 1,
    fontSize: theme.font.size.m,
    fontFamily: theme.font.family.regular,
    color: theme.color.text,
  },
  helper: {
    marginTop: 6,
    color: theme.color.muted,
    fontSize: theme.font.size.s,
    fontFamily: theme.font.family.regular,
  },
  error: {
    marginTop: 6,
    color: theme.color.danger,
    fontSize: theme.font.size.s,
    fontFamily: theme.font.family.semibold,
    fontWeight: '600',
  },
});