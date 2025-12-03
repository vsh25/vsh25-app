// app/auth/ForgotStart.tsx
// Шаг 1 восстановления: ввод email, отправка кода (forgotStart).

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
import { forgotStart } from '../api/auth';

type Props = {
  navigation: any;
};

export default function ForgotStart({ navigation }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Введите email');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await forgotStart({ email: trimmed });

      navigation.navigate('ForgotOtp', {
        email: trimmed,
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
        <Text style={styles.title}>
          {t('auth.forgotTitle', 'Восстановление пароля')}
        </Text>
        <Text style={styles.subtitle}>
          {t(
            'auth.forgotSubtitle',
            'Введите email — отправим код для восстановления пароля.'
          )}
        </Text>

        <Text style={styles.label}>
          {t('auth.emailLabel', 'Email')}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.emailPlaceholder', 'Введите email')}
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={{ marginTop: 24 }}>
          <UIButton
            title={t('auth.forgotSendCode', 'Отправить код')}
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
    backgroundColor: '#020617',
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
