import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { requestOtp } from '../api/auth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { theme } from '../theme';

export default function Login({ navigation }: any) {
  const [id, setId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const trimmed = id.trim();
  const isPhone = /^\+?\d[\d\s\-()]{5,}$/.test(trimmed);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

  const sendCode = async () => {
    if (!isPhone && !isEmail) { setError('Введите корректный email или телефон'); return; }
    setError(null);
    try {
      await requestOtp(trimmed);
      navigation.navigate('Otp', { identifier: trimmed });
    } catch (e: any) {
      Alert.alert('Ошибка', e?.message ?? 'Не удалось отправить код');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F7E3E7', '#E6EEFF']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.wrap}
      >
        <Text style={styles.title}>Вход</Text>
        <Text style={styles.subtitle}>
          Введите email или телефон — отправим одноразовый код.
        </Text>

        <View style={{ height: 16 }} />

        <Input
          value={id}
          onChangeText={setId}
          placeholder="Email или телефон"
          autoCapitalize="none"
          inputMode={isPhone ? 'tel' : 'email'}
          keyboardType={isPhone ? 'phone-pad' : 'default'}
          autoComplete={isPhone ? 'tel' : 'email'}
          textContentType={isPhone ? 'telephoneNumber' : 'emailAddress'}
          error={error || undefined}
          fullWidth
        />

        <View style={{ height: 16 }} />

        <Button title="Получить код" onPress={sendCode} fullWidth />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 24, paddingTop: 48 },
  title: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 28,
    color: theme.color.text,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: theme.color.muted,
  },
});