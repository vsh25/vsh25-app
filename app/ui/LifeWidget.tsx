import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../theme';
import Progress from './Progress';
import Chip from './Chip';
import { useDailyProgress } from '../DailyProgress';
import { useTranslation } from 'react-i18next';

export default function LifeWidget() {
  const { t } = useTranslation();
  const { isCompletedToday } = useDailyProgress();
  const bioDone = isCompletedToday('bio');
  const pillDone = isCompletedToday('pill');
  const done = (bioDone ? 1 : 0) + (pillDone ? 1 : 0);
  const value = done / 2;

  return (
    <View
      style={{
        padding: 16,
        borderRadius: theme.radius.l,
        backgroundColor: theme.color.surface,
        borderWidth: 1,
        borderColor: theme.color.border,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontWeight: '700', color: theme.color.text, marginBottom: 6 }}>
        {t('life.title', 'Продление жизни')}
      </Text>

      <Text style={{ color: theme.color.muted, marginBottom: 10 }}>
        {t('life.done', 'Выполнено сегодня')}: {done}/2
      </Text>

      <Progress value={value} />

      <View style={{ height: 10 }} />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Chip
          text={`${bioDone ? '✓' : '—'} ${t('life.bio', 'Биопрограмма')}`}
          active={bioDone}
          muted={!bioDone}
        />
        <Chip
          text={`${pillDone ? '✓' : '—'} ${t('life.pill', 'Таблетка')}`}
          active={pillDone}
          muted={!pillDone}
        />
      </View>
    </View>
  );
}