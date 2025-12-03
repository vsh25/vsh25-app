// app/auth/ForgotReset.tsx
// Шаг 3 восстановления: новый пароль.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import UIButton from '../ui/Button';
import { theme } from '../theme';
import { forgotReset } from '../api/auth';

type Props = {
  navigation: any;
  route: any;
};

export default function ForgotReset({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { requestId, email } = route.params || {};

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!requestId) {
      setError('Нет идентификатора восстановления. Попробуйте заново.');
      return;
    }
    if (!password.trim() || !confirm.trim()) {
      setError('Заполните оба поля');
      return;
    }
    if (password.trim() !== confirm.trim()) {
      setError('Пароли не совпадают');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await forgotReset({
        requestId,
        newPassword: password.trim(),
      });

      if (!res.success) {
        throw new Error('Не удалось обновить пароль');
      }

      Alert.alert(
        'Пароль обновлён',
        'Теперь вы можете войти с новым паролем (на сайте).',
        [
          {
            text: 'Ок',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (e: any) {
      setError(e?.message || 'Не удалось обновить пароль. Попробуйте ещё раз.');
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
          {t('auth.forgotResetTitle', 'Новый пароль')}
        </Text>
        {email && (
          <Text style={styles.subtitle}>
            {t(
              'auth.forgotResetSubtitleWithEmail',
              'Email: {{email}}',
              { email }
            )}
          </Text>
        )}

        <Text style={styles.label}>{t('auth.passwordLabel', 'Новый пароль')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.passwordPlaceholder', 'Введите новый пароль')}
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>
          {t('auth.passwordConfirmLabel', 'Повторите пароль')}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.passwordConfirmPlaceholder', 'Повторите пароль')}
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={{ marginTop: 24 }}>
          <UIButton
            title={t('auth.forgotResetButton', 'Обновить пароль')}
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
