import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadFileMock, downloadFile } from '../../shared/api/fileApi';

/**
 * Экран для работы с файлами - загрузка и скачивание документов
 * Демонстрирует возможности работы с файловой системой в React Native
 */
export default function FilesScreen() {
  const [selectedFile, setSelectedFile] = useState<{ name?: string; uri?: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  // Открываем системный диалог выбора файла
  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ multiple: false, copyToCacheDirectory: true });
    if (res.canceled) {
      setStatus('❌ Выбор отменён');
      return;
    }
    const asset = res.assets?.[0];
    if (asset) {
      setSelectedFile({ name: asset.name, uri: asset.uri });
      setStatus('✅ Файл выбран: ' + (asset.name ?? ''));
    } else {
      setStatus('⚠️ Файл не выбран');
    }
  };

  // Отправляем выбранный файл (в данном случае это мок-функция для демонстрации)
  const upload = async () => {
    if (!selectedFile?.uri) {
      setStatus('⚠️ Сначала выберите файл');
      return;
    }
    setStatus('📤 Отправка...');
    setUploadProgress(0);
    const r = await uploadFileMock(selectedFile.uri, setUploadProgress);
    if (r.success) setStatus('✅ Готово: файл отправлен');
  };

  // Скачиваем тестовый PDF файл с прогресс-баром
  const download = async () => {
    setStatus('📥 Скачивание...');
    setDownloadProgress(0);
    try {
      const r = await downloadFile(
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        'dummy.pdf',
        setDownloadProgress
      );
      setStatus('✅ Готово: файл сохранён');
    } catch (e) {
      setStatus('❌ Ошибка скачивания');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📁 Управление файлами</Text>
      <Text style={styles.subtitle}>Отправка и скачивание документов</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📤 Отправка файла</Text>
        
        <TouchableOpacity style={styles.button} onPress={pickFile}>
          <Text style={styles.buttonText}>📎 Выбрать файл</Text>
        </TouchableOpacity>
        
        {selectedFile?.name && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileLabel}>Выбранный файл:</Text>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
          </View>
        )}
        
        {uploadProgress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonPrimary]} 
          onPress={upload}
          disabled={!selectedFile}
        >
          <Text style={styles.buttonTextPrimary}>🚀 Отправить</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📥 Скачивание файла</Text>
        
        {downloadProgress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${downloadProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{downloadProgress}%</Text>
          </View>
        )}
        
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={download}>
          <Text style={styles.buttonTextSecondary}>⬇️ Скачать пример PDF</Text>
        </TouchableOpacity>
      </View>

      {status ? (
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4, color: '#1e293b' },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16, color: '#334155' },
  button: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
  },
  buttonSecondary: {
    backgroundColor: '#10b981',
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#475569' },
  buttonTextPrimary: { fontSize: 16, fontWeight: '600', color: '#fff' },
  buttonTextSecondary: { fontSize: 16, fontWeight: '600', color: '#fff' },
  fileInfo: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  fileLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  fileName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  progressContainer: { marginBottom: 12 },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressText: { fontSize: 12, color: '#64748b', textAlign: 'right' },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  statusText: { fontSize: 14, color: '#334155', lineHeight: 20 },
});