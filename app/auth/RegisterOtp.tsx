// app/auth/RegisterOtp.tsx
// Шаг 2 регистрации: ввод кода, проверка через registerVerify.

import React, { useEffect, useState } from 'react';
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
import { registerVerify } from '../api/auth';

type Props = {
  navigation: any;
  route: any;
};

export default function RegisterOtp({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { contact, requestId, ttl = 60 } = route.params || {};

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(ttl);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [ttl]);

  const onSubmit = async () => {
    if (code.length !== 6) {
      setError('Введите код из 6 цифр');
      return;
    }
    if (!requestId) {
      setError('Нет идентификатора регистрации. Попробуйте ещё раз.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await registerVerify({ requestId, code });
      if (!res.ok) {
        throw new Error('Код не подтверждён');
      }
      navigation.navigate('RegisterDetails', { requestId, contact });
    } catch (e: any) {
      setError(e?.message || 'Не удалось подтвердить код. Попробуйте ещё раз.');
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
          {t('auth.registerOtpTitle', 'Подтверждение регистрации')}
        </Text>
        <Text style={styles.subtitle}>
          {contact
            ? t(
                'auth.registerOtpSubtitleWithContact',
                'Введите код, отправленный для {{contact}}',
                { contact }
              )
            : t('auth.registerOtpSubtitle', 'Введите код, отправленный на ваш контакт')}
        </Text>

        <Text style={styles.label}>
          {t('auth.codeLabel', 'Код из 6 цифр')}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.codePlaceholder', '••••••')}
          placeholderTextColor="#6B7280"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={{ marginTop: 24 }}>
          <UIButton
            title={t('auth.otpConfirmButton', 'Подтвердить')}
            onPress={onSubmit}
            loading={loading}
            fullWidth
          />
        </View>

        <Text style={styles.timerText}>
          {secondsLeft > 0
            ? t(
                'auth.otpResendIn',
                'Повторная отправка через {{sec}} сек',
                { sec: secondsLeft }
              )
            : t('auth.otpResendReady', 'Можно запросить код повторно')}
        </Text>
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
    fontSize: 20,
    letterSpacing: 8,
    textAlign: 'center',
  },
  error: {
    marginTop: 12,
    color: '#F97373',
    fontSize: 13,
  },
  timerText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
  },
});
