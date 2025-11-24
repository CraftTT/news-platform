import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export default function ErrorState({ message, onRetry, retryLabel = 'Повторить' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.btn} onPress={onRetry}>
          <Text style={styles.btnText}>{retryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  text: { fontSize: 14, color: '#c00', marginBottom: 12, textAlign: 'center' },
  btn: { backgroundColor: '#f2f2f2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6 },
  btnText: { fontWeight: '600' },
});