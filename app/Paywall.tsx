import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import UIButton from './ui/Button';
import { theme } from './theme';
import { useSubscription } from './subscription/Subscription';
import { useTranslation } from 'react-i18next';
import ListItem from './ui/ListItem';

export default function Paywall({ navigation }: any) {
  const { activate, deactivate, active } = useSubscription();
  const { t } = useTranslation();

  const buy = async () => {
    await activate();
    Alert.alert(t('paywall.title'), t('paywall.activated'));
    navigation.goBack();
  };

  const restore = async () => {
    await activate();
    Alert.alert(t('paywall.title'), t('paywall.restored'));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>{t('paywall.heroTitle')}</Text>
        <Text style={styles.caption}>{t('paywall.heroCaption')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('paywall.benefitsTitle')}</Text>
        <ListItem text={t('paywall.b1')} />
        <ListItem text={t('paywall.b2')} />
        <ListItem text={t('paywall.b3')} />
        <Text style={[styles.status]}>
          Статус: {active ? 'активна' : 'не активна'}
        </Text>
      </View>

      <View style={{ height: 20 }} />
      <UIButton title={t('paywall.buy')} onPress={buy} fullWidth />
      <View style={{ height: 12 }} />
      <UIButton title={t('paywall.restore')} variant="outline" onPress={restore} fullWidth />
      <View style={{ height: 12 }} />
      <UIButton title={t('paywall.mockOff')} variant="outline" onPress={deactivate} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.color.bg },
  hero: {
    padding: 16,
    borderRadius: theme.radius.l,
    backgroundColor: '#F1F5FF',
    borderWidth: 1, borderColor: theme.color.border,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '700', color: theme.color.text, marginBottom: 6 },
  caption: { color: theme.color.muted },
  card: {
    padding: 16,
    borderRadius: theme.radius.l,
    backgroundColor: theme.color.bg,
    borderWidth: 1, borderColor: theme.color.border,
  },
  cardTitle: { fontWeight: '700', marginBottom: 6, color: theme.color.text },
  status: { marginTop: 12, color: theme.color.muted },
});