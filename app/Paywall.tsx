import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import UIButton from './ui/Button';
import { theme } from './theme';

export default function Paywall() {
  const buy = () => Alert.alert('Покупка', 'Это заглушка. Логику IAP добавим позже.');
  const restore = () => Alert.alert('Восстановление', 'Тоже заглушка. Добавим позже.');

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Подписка VSH25</Text>
        <Text style={styles.caption}>
          Доступ к Биопрограмме и Цифровой таблетке, календарю и напоминаниям.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Что получите</Text>
        <Text style={styles.li}>• Ежедневные видео-сессии</Text>
        <Text style={styles.li}>• Учёт прогресса и календарь</Text>
        <Text style={styles.li}>• Напоминания и рекомендации</Text>
      </View>

      <View style={{ height: 16 }} />

      <UIButton title="Купить" onPress={buy} fullWidth />
      <View style={{ height: 12 }} />
      <UIButton title="Восстановить покупку" variant="outline" onPress={restore} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.color.bg },
  hero: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F1F5FF',
    borderWidth: 1, borderColor: theme.color.border,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '700', color: theme.color.text, marginBottom: 6 },
  caption: { color: theme.color.muted },
  card: {
    padding: 16, borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: theme.color.border,
  },
  cardTitle: { fontWeight: '700', marginBottom: 8, color: theme.color.text },
  li: { marginTop: 4, color: theme.color.text },
});