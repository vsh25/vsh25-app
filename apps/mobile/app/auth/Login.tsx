import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { requestOtp } from '../api/auth';

export default function Login({ navigation }: any) {
  const [id, setId] = useState('');

  const sendCode = async () => {
    try {
      await requestOtp(id);
      navigation.navigate('Otp', { identifier: id });
    } catch (e: any) {
      Alert.alert('Ошибка', e.message ?? 'Не удалось отправить код');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: '600' }}>Вход</Text>
      <TextInput
        value={id}
        onChangeText={setId}
        placeholder="Email или телефон"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
      />
      <Button title="Получить код" onPress={sendCode} />
    </View>
  );
}