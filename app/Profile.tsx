import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import UIButton from './ui/Button';
import { theme } from './theme';
import * as Notifications from 'expo-notifications';
import { useSession } from './session/Session';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { setLanguage } from './i18n/lang';
import { H2, Subtle } from './ui/Typography';
import { toast } from './ui/toast';
import { useGating } from './flags/gating';

export default function Profile() {
  const { signOut } = useSession();
  const { t } = useTranslation();
  const current = (i18n.language as 'ru' | 'en') || 'ru';

  const { mode, setMode } = useGating();
  const bioIsPay = mode.bio === 'pay';
  const pillIsPay = mode.pill === 'pay';
  const kbIsPay  = mode.kb  === 'pay';

  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState(false);

  const ensurePerms = async () => {
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') ({ status } = await Notifications.requestPermissionsAsync());
    if (status !== 'granted') {
      Alert.alert(
        'Уведомления выключены',
        'Разрешите уведомления в настройках системы.',
        [{ text: 'Ок' }]
      );
      return false;
    }
    return true;
  };

  const enable21 = async () => {
    if (enabling || disabling) return;
    try {
      setEnabling(true);
      if (!(await ensurePerms())) return;
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: { title: 'VSH25', body: 'Время биопрограммы. 10 минут — и день засчитан.' },
        trigger: { hour: 21, minute: 0, repeats: true },
      });
      toast('Ежедневное напоминание в 21:00 включено');
    } finally {
      setEnabling(false);
    }
  };

  const disableAll = async () => {
    if (enabling || disabling) return;
    try {
      setDisabling(true);
      await Notifications.cancelAllScheduledNotificationsAsync();
      toast('Ежедневные напоминания отключены');
    } finally {
      setDisabling(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 20 }}>👤</Text>
        <H2 style={{ marginBottom: 0 }}>{t('profile.title', 'Профиль')}</H2>
      </View>

      {/* Язык */}
      <Subtle style={{ marginBottom: 8 }}>
        {t('profile.language', 'Язык интерфейса')}
      </Subtle>
      <View style={styles.row}>
        <UIButton
          title={t('profile.ru', 'Русский')}
          variant={current === 'ru' ? 'primary' : 'outline'}
          onPress={() => setLanguage('ru')}
        />
        <View style={{ width: 8 }} />
        <UIButton
          title={t('profile.en', 'English')}
          variant={current === 'en' ? 'primary' : 'outline'}
          onPress={() => setLanguage('en')}
        />
      </View>

      {/* Доступ к контенту (гейтинг) */}
      <View style={{ height: 20 }} />
      <Subtle style={{ marginBottom: 8 }}>Доступ к контенту</Subtle>

      <UIButton
        title={bioIsPay ? 'Биопрограмма: платно → сделать бесплатно' : 'Биопрограмма: бесплатно → сделать платно'}
        variant={bioIsPay ? 'outline' : 'primary'}
        onPress={() => setMode('bio', bioIsPay ? 'free' : 'pay')}
        fullWidth
      />
      <View style={{ height: 8 }} />
      <UIButton
        title={pillIsPay ? 'Таблетка: платно → сделать бесплатно' : 'Таблетка: бесплатно → сделать платно'}
        variant={pillIsPay ? 'outline' : 'primary'}
        onPress={() => setMode('pill', pillIsPay ? 'free' : 'pay')}
        fullWidth
      />
      <View style={{ height: 8 }} />
      <UIButton
        title={kbIsPay ? 'База знаний: платно → сделать бесплатно' : 'База знаний: бесплатно → сделать платно'}
        variant={kbIsPay ? 'outline' : 'primary'}
        onPress={() => setMode('kb', kbIsPay ? 'free' : 'pay')}
        fullWidth
      />

      {/* Напоминания */}
      <View style={{ height: 20 }} />
      <UIButton
        title={t('buttons.reminders', 'Напоминания 21:00')}
        onPress={enable21}
        loading={enabling}
        disabled={disabling}
        fullWidth
      />
      <View style={{ height: 12 }} />
      <UIButton
        title="Отключить напоминания"
        variant="outline"
        onPress={disableAll}
        loading={disabling}
        disabled={enabling}
        fullWidth
      />

      {/* Выход */}
      <View style={{ height: 20 }} />
      <UIButton title={t('auth.logout', 'Выйти')} variant="outline" onPress={signOut} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.color.bg },
  row: { flexDirection: 'row', alignItems: 'center' },
});