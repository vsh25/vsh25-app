import React from 'react';
import { View, Text, Pressable } from 'react-native';
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
      colors={theme.grad.hero}             // см. theme.grad.hero
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: theme.radius.xl,     // 24
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ffffff1a',
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6 }}>
        {title}
      </Text>

      <Text style={{ color: '#E6F0FF', marginBottom: 14, lineHeight: 18 }}>
        {subtitle}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* Primary */}
        <UIButton title={primaryText} onPress={onPrimary} />

        {/* Secondary – стеклянная кнопка на градиенте */}
        <Pressable
          onPress={onSecondary}
          style={({ pressed }) => ({
            height: 44,
            paddingHorizontal: 16,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? '#ffffff33' : '#ffffff26', // стекло
            borderWidth: 1,
            borderColor: '#ffffff3d',
          })}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>{secondaryText}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}