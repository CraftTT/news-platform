import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

export default function ArticleWebViewScreen() {
  const route = useRoute() as any;
  const url: string | undefined = route.params?.url;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!url) {
    return (
      <View style={styles.center}>
        <Text>URL статьи не передан</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Не удалось загрузить страницу</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => { setError(null); setLoading(true); }}>
            <Text style={styles.retryText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <WebView
            source={{ uri: url }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => setError('fail')}
          />
          {loading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  errorText: { color: '#c00', marginBottom: 8 },
  retryBtn: { paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#e0f0ff', borderRadius: 6 },
  retryText: { color: '#0366d6' },
});