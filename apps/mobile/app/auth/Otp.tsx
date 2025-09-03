import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { verifyOtp } from '../api/auth';
import { useSession } from '../session/Session';

export default function Otp({ route, navigation }: any) {
  const identifier: string = route?.params?.identifier ?? '';
  const [code, setCode] = useState('');
  const { signIn } = useSession();

  const confirm = async () => {
    try {
      const res = await verifyOtp(identifier, code);
      await signIn(res.token);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); // в приложение
    } catch (e: any) {
      Alert.alert('Ошибка', e.message ?? 'Неверный код');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: '600' }}>Код из {identifier.includes('@') ? 'email' : 'SMS'}</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="6 цифр"
        keyboardType="number-pad"
        maxLength={6}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, letterSpacing: 4 }}
      />
      <Button title="Подтвердить" onPress={confirm} />
    </View>
  );
}