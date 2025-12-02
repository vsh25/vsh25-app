// app/auth/Login.tsx
// Вход по email или телефону — отправляем одноразовый код (как на сайте).

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import UIButton from '../ui/Button';
import { theme } from '../theme';
import { requestCode } from '../api/auth';

type Props = {
  navigation: any;
};

export default function Login({ navigation }: Props) {
  const { t } = useTranslation();
  const [contact, setContact] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const trimmed = contact.trim();
    if (!trimmed) {
      setError('Введите email или телефон');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // теперь реально вызываем API-слой (пока через моки)
      const res = await requestCode({ contact: trimmed });

      // передаём на экран Otp и контакт, и requestId, и ttl
      navigation.navigate('Otp', {
        contact: trimmed,
        requestId: res.requestId,
        ttl: res.ttl,
      });
    } catch (e: any) {
      setError(e?.message || 'Не удалось отправить код. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logoText}>VSH25</Text>

        <Text style={styles.title}>
          {t('auth.signInTitle', 'Вход')}
        </Text>
        <Text style={styles.subtitle}>
          {t(
            'auth.signInOtpSubtitle',
            'Введите email или телефон — отправим одноразовый код.'
          )}
        </Text>

        <Text style={styles.label}>
          {t('auth.contactLabel', 'Email или телефон')}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.contactPlaceholder', 'Email или телефон')}
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
          keyboardType="email-address"
          value={contact}
          onChangeText={setContact}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={{ marginTop: 24 }}>
          <UIButton
            title={t('auth.getCodeButton', 'Получить код')}
            onPress={onSubmit}
            loading={loading}
            fullWidth
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617', // тёмный фон
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#0B1220',
  },
  logoText: {
    textAlign: 'center',
    color: '#E5E7EB',
    fontSize: 18,
    letterSpacing: 4,
    marginBottom: 12,
  },
  title: {
    textAlign: 'left',
    color: '#F9FAFB',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'left',
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 20,
  },
  label: {
    color: '#E5E7EB',
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#020617',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F9FAFB',
    fontSize: 15,
  },
  error: {
    marginTop: 12,
    color: '#F97373',
    fontSize: 13,
  },
});
