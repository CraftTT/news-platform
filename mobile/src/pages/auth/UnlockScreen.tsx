import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAppDispatch } from '../../app/store';
import { setAuthenticated } from '../../entities/auth/slice';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../app/navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Unlock'>;

export default function UnlockScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !enrolled) {
        setError('Биометрия недоступна или не настроена');
        setLoading(false);
        return;
      }
      const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Войти', cancelLabel: 'Отмена' });
      setLoading(false);
      if (res.success) {
        dispatch(setAuthenticated(true));
        navigation.replace('Tabs');
      } else {
        setError(res.error ?? 'Не удалось пройти проверку');
      }
    } catch (e: any) {
      setLoading(false);
      setError(e?.message ?? 'Ошибка биометрии');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Разблокировка</Text>
      <Text style={styles.subtitle}>Нажмите «Войти» для биометрической проверки</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Войти</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16, textAlign: 'center' },
  error: { color: '#c00', marginBottom: 12 },
  button: { backgroundColor: '#e0f0ff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  buttonText: { fontWeight: '600' },
});