import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UIButton from './ui/Button';
import { theme } from './theme';
import { useSubscription } from './subscription/Subscription';
import { useTranslation } from 'react-i18next';
import ListItem from './ui/ListItem';
import { H2, Subtle } from './ui/Typography';
import { toast } from './ui/toast';

export default function Paywall({ navigation }: any) {
  const { activate, deactivate, active } = useSubscription();
  const { t } = useTranslation();

  const [buying, setBuying] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [disabling, setDisabling] = useState(false);

  const buy = async () => {
    if (buying || restoring || disabling) return;
    try {
      setBuying(true);
      await activate();
      toast(t('paywall.activated'));
      navigation.goBack();
    } finally {
      setBuying(false);
    }
  };

  const restore = async () => {
    if (buying || restoring || disabling) return;
    try {
      setRestoring(true);
      await activate();
      toast(t('paywall.restored'));
      navigation.goBack();
    } finally {
      setRestoring(false);
    }
  };

  const disable = async () => {
    if (buying || restoring || disabling) return;
    try {
      setDisabling(true);
      await deactivate();
      toast(t('paywall.mockOff'));
    } finally {
      setDisabling(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <H2>{t('paywall.heroTitle')}</H2>
        <Subtle>{t('paywall.heroCaption')}</Subtle>
      </View>

      {/* Benefits */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('paywall.benefitsTitle')}</Text>
        <ListItem text={t('paywall.b1')} />
        <ListItem text={t('paywall.b2')} />
        <ListItem text={t('paywall.b3')} />
        <Text style={styles.status}>Статус: {active ? 'активна' : 'не активна'}</Text>
      </View>

      {/* CTA */}
      <View style={{ height: 20 }} />
      <UIButton title={t('paywall.buy')} onPress={buy} loading={buying} disabled={restoring || disabling} fullWidth />
      <View style={{ height: 12 }} />
      <UIButton
        title={t('paywall.restore')}
        variant="outline"
        onPress={restore}
        loading={restoring}
        disabled={buying || disabling}
        fullWidth
      />
      <View style={{ height: 12 }} />
      <UIButton
        title={t('paywall.mockOff')}
        variant="outline"
        onPress={disable}
        loading={disabling}
        disabled={buying || restoring}
        fullWidth
      />
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
  card: {
    padding: 16,
    borderRadius: theme.radius.l,
    backgroundColor: theme.color.bg,
    borderWidth: 1, borderColor: theme.color.border,
  },
  cardTitle: { fontWeight: '700', marginBottom: 6, color: theme.color.text },
  status: { marginTop: 12, color: theme.color.muted },
});