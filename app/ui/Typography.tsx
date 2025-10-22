import React from 'react';
import { Text, TextProps } from 'react-native';
import { theme } from '../theme';

export function H1(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        { fontSize: 24, fontWeight: '700', color: theme.color.text, marginBottom: 12 },
        props.style,
      ]}
    />
  );
}

export function H2(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        { fontSize: 22, fontWeight: '700', color: theme.color.text, marginBottom: 10 },
        props.style,
      ]}
    />
  );
}

export function Subtle(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        { color: theme.color.muted, fontSize: 13 },
        props.style,
      ]}
    />
  );
}