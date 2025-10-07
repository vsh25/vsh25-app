import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UIButton from './Button';
import { theme } from '../theme';

type Props = {
  title?: string;
  subtitle?: string;
  onPrimary?: () => void;   // «Смотреть Биопрограмму»
  onSecondary?: () => void; // «Подписка»
  primaryText?: string;
  secondaryText?: string;
};

export default function HomeHero({
  title = 'VSH25 — продление жизни',
  subtitle = 'Ежедневные короткие практики: Биопрограмма и Цифровая таблетка',
  onPrimary,
  onSecondary,
  primaryText = 'Смотреть Биопрограмму',
  secondaryText = 'Подписка',
}: Props) {
  return (
    <LinearGradient
      colors={theme.grad.hero}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: theme.radius.xl,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ffffff1a',
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6 }}>
        {title}
      </Text>
      <Text style={{ color: '#E5F0FF', marginBottom: 14 }}>
        {subtitle}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <UIButton title={primaryText} onPress={onPrimary} />
        <UIButton title={secondaryText} variant="outline" onPress={onSecondary} />
      </View>
    </LinearGradient>
  );
}