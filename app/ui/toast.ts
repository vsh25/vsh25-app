import { Platform, ToastAndroid, Alert } from 'react-native';

export function toast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // простой фолбэк для iOS
    Alert.alert('', message);
  }
}