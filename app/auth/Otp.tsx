import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { verifyOtp, requestOtp } from '../api/auth';
import { useSession } from '../session/Session';

const RESEND_SECONDS = 30;

export default function Otp({ route, navigation }: any) {
  const identifier: string = route?.params?.identifier ?? '';
  const { signIn } = useSession();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(RESEND_SECONDS);     // таймер
  const canSubmit = useMemo(() => /^\d{6}$/.test(code), [code]);

  // обратный отсчёт
  useEffect(() => {
    setLeft(RESEND_SECONDS); // каждый раз при открытии
  }, [identifier]);

  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [left]);

  const confirm = async () => {
    if (!canSubmit) { setError('Введите 6 цифр'); return; }
    setError(null);
    try {
      const res = await verifyOtp(identifier, code);
      await signIn(res.token);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e: any) {
      setError(e?.message ?? 'Неверный код');
    }
  };

  const resend = async () => {
    try {
      await requestOtp(identifier);
      setLeft(RESEND_SECONDS);
      Alert.alert('Код отправлен', `Мы повторно отправили код на ${identifier}`);
    } catch (e: any) {
      Alert.alert('Ошибка', e?.message ?? 'Не удалось отправить код');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 4 }}>
        Подтверждение
      </Text>
      <Text style={{ color: '#64748B', marginBottom: 8 }}>
        Введите код из {identifier.includes('@') ? 'email' : 'SMS'} для {identifier}
      </Text>

      <Input
        value={code}
        onChangeText={(t) => setCode(t.replace(/[^\d]/g, '').slice(0, 6))}
        placeholder="••••••"
        keyboardType="number-pad"
        inputMode="numeric"
        autoFocus
        letterSpacing={6}
        textAlign="center"
        maxLength={6}
        error={error || undefined}
        helperText={!error ? 'Код из 6 цифр' : undefined}
        fullWidth
      />

      <Button title="Подтвердить" onPress={confirm} disabled={!canSubmit} fullWidth />

      <View style={{ height: 8 }} />

      {left > 0 ? (
        <Text style={{ textAlign: 'center', color: '#64748B' }}>
          Повторная отправка через {left} сек
        </Text>
      ) : (
        <Button title="Отправить код повторно" variant="outline" onPress={resend} fullWidth />
      )}
    </View>
  );
}