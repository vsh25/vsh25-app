// app/auth/RegisterStart.tsx
// Шаг 1 регистрации: выбор канал (телефон/почта) + контакт.

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
import { registerStart, RegisterChannel } from '../api/auth';

type Props = {
  navigation: any;
};

export default function RegisterStart({ navigation }: Props) {
  const { t } = useTranslation();
  const [channel, setChannel] = useState<RegisterChannel>('phone');
  const [contact, setContact] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const trimmed = contact.trim();
    if (!trimmed) {
      setError('Введите телефон или email');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await registerStart({ contact: trimmed, channel });
      navigation.navigate('RegisterOtp', {
        contact: trimmed,
        channel,
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
          {t('auth.registerTitle', 'Регистрация')}
        </Text>
        <Text style={styles.subtitle}>
          {t(
            'auth.registerSubtitle',
            'Зарегистрируйтесь, чтобы начать — отправим код на выбранный контакт.'
          )}
        </Text>

        {/* Табы Телефон / Почта */}
        <View style={styles.tabsRow}>
          <UIButton
            title={t('auth.phoneTab', 'Телефон')}
            variant={channel === 'phone' ? 'primary' : 'outline'}
            onPress={() => setChannel('phone')}
            style={styles.tabButton}
          />
          <UIButton
            title={t('auth.emailTab', 'Почта')}
            variant={channel === 'email' ? 'primary' : 'outline'}
            onPress={() => setChannel('email')}
            style={styles.tabButton}
          />
        </View>

        <Text style={styles.label}>
          {channel === 'phone'
            ? t('auth.phoneLabel', 'Телефон')
            : t('auth.emailLabel', 'Email')}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={
            channel === 'phone'
              ? t('auth.phonePlaceholder', 'Введите номер телефона')
              : t('auth.emailPlaceholder', 'Введите email')
          }
          placeholderTextColor="#6B7280"
          keyboardType={channel === 'phone' ? 'phone-pad' : 'email-address'}
          autoCapitalize="none"
          value={contact}
          onChangeText={setContact}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={{ marginTop: 24 }}>
          <UIButton
            title={t('auth.registerSendCode', 'Отправить код')}
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
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
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
