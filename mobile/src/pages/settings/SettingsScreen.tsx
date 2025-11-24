import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '../../app/store';
import { logout } from '../../entities/auth/slice';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../app/navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();

  const onLogout = () => {
    dispatch(logout());
    navigation.replace('Unlock');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  button: { backgroundColor: '#ffecec', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#c00', fontWeight: '600' },
});