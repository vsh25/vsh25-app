import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UIButton from './ui/Button';
import { useSession } from './session/Session';
import { theme } from './theme';
import i18n from './i18n';
import { setLanguage } from './i18n/lang';

export default function Profile({ navigation }: any) {
  const { signOut } = useSession();
  const current = i18n.language === 'en' ? 'en' : 'ru';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>

      {/* Блок выбора языка */}
      <Text style={styles.sectionTitle}>Язык интерфейса</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
        <UIButton
          title="Русский"
          variant={current === 'ru' ? 'primary' : 'outline'}
          onPress={() => setLanguage('ru')}
        />
        <UIButton
          title="English"
          variant={current === 'en' ? 'primary' : 'outline'}
          onPress={() => setLanguage('en')}
        />
      </View>

      {/* Переход на экран Напоминания */}
      <UIButton
        title="Напоминания"
        onPress={() => navigation.navigate('Reminders')}
        fullWidth
      />

      <View style={{ height: 12 }} />

      {/* Выход */}
      <UIButton
        title="Выйти"
        variant="outline"
        onPress={signOut}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.color.bg },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16, color: theme.color.text },
  sectionTitle: { marginBottom: 6, color: theme.color.text, fontWeight: '600' },
});