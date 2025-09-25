import React from 'react';
import { Pressable, View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { theme } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
};

export default function Card({ title, subtitle, imageUrl, onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }, style]}>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.cover} /> : <View style={[styles.cover, { backgroundColor: theme.color.surface }]} />}
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.l,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  cover: { height: 120, width: '100%' },
  texts: { padding: 14 },
  title: {
    fontFamily: theme.font.family.semibold,
    fontSize: theme.font.size.l,
    color: theme.color.text,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: theme.font.family.regular,
    fontSize: theme.font.size.s,
    color: theme.color.muted,
  },
});