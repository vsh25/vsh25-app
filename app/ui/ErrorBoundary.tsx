import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type Props = { fallback?: React.ReactNode; children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // здесь можно добавить логирование в консоль/аналитику
    console.log('ErrorBoundary caught', error, info?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <View style={styles.fallback}>
            <Text style={styles.title}>Что-то пошло не так</Text>
            <Text style={styles.text}>Попробуйте закрыть экран и открыть снова.</Text>
          </View>
        )
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: theme.color.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 18, fontWeight: '700', color: theme.color.text, marginBottom: 8 },
  text: { color: theme.color.muted, textAlign: 'center' },
});