import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../ui/Button';
import { theme } from '../theme';

export default function GetStarted({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F7E3E7', '#E6EEFF']} // мягкий фон из UI-кита (можно заменить на точные из макета)
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.brand}>VSH25</Text>
        <Text style={styles.title}>Твоё активное долголетие</Text>
        <Text style={styles.subtitle}>
          Короткие ежедневные практики: биопрограмма (10 мин) и «цифровая таблетка» (30 сек).
        </Text>
        <View style={{ height: 24 }} />
        <Button title="Продолжить" fullWidth onPress={() => navigation.navigate('Login')} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, paddingHorizontal: 24, paddingTop: 80 },
  brand: {
    fontFamily: 'Rubik-Bold',
    fontSize: 24,
    color: theme.color.text,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 28,
    color: theme.color.text,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: theme.color.muted,
    lineHeight: 22,
    marginTop: 4,
  },
});