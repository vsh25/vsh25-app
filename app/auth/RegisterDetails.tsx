// app/auth/RegisterDetails.tsx
// Шаг 3 регистрации: 4 поля (имя, фамилия, пароль, согласие) + завершение.

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
import { registerComplete } from '../api/auth';
import { useSession } from '../session/Session';

type Props = {
  navigation: any;
  route: any;
};

export default function RegisterDetails({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { signIn } = useSession();
  const { requestId, contact } = route.params || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!requestId) {
      setError('Нет идентификатора регистрации. Попробуйте заново.');
      return;
    }
    if (!firstName.trim() || !lastName.trim() || !password.trim()) {
      setError('Заполните все поля');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await registerComplete({
        requestId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password: password.trim(),
      });

      await signIn(res.token);
      // RootStacks сам переключит нас на Home
    } catch (e: any) {
      setError(e?.message || 'Не удалось завершить регистрацию. Попробуйте ещё раз.');
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
          {t('auth.registerDetailsTitle', 'Заполните данные')}
        </Text>
        {contact && (
          <Text style={styles.subtitle}>
            {t(
              'auth.registerDetailsSubtitleWithContact',
              'Контакт: {{contact}}',
              { contact }
            )}
          </Text>
        )}

        <Text style={styles.label}>{t('auth.firstName', 'Имя')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.firstNamePlaceholder', 'Введите имя')}
          placeholderTextColor="#6B7280"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>{t('auth.lastName', 'Фамилия')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.lastNamePlaceholder', 'Введите фамилию')}
          placeholderTextColor="#6B7280"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>{t('auth.passwordLabel', 'Пароль')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.passwordPlaceholder', 'Придумайте пароль')}
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={{ marginTop: 24 }}>
          <UIButton
            title={t('auth.registerFinishButton', 'Завершить регистрацию')}
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
