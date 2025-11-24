import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadFileMock, downloadFile } from '../../shared/api/fileApi';

export default function FilesScreen() {
  const [selectedFile, setSelectedFile] = useState<{ name?: string; uri?: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ multiple: false, copyToCacheDirectory: true });
    if (res.canceled) {
      setStatus('Выбор отменён');
      return;
    }
    const asset = res.assets?.[0];
    if (asset) {
      setSelectedFile({ name: asset.name, uri: asset.uri });
      setStatus('Файл выбран: ' + (asset.name ?? ''));
    } else {
      setStatus('Файл не выбран');
    }
  };

  const upload = async () => {
    if (!selectedFile?.uri) {
      setStatus('Сначала выберите файл');
      return;
    }
    setStatus('Отправка...');
    setUploadProgress(0);
    const r = await uploadFileMock(selectedFile.uri, setUploadProgress);
    if (r.success) setStatus('Готово: файл отправлен (мок)');
  };

  const download = async () => {
    setStatus('Скачивание...');
    setDownloadProgress(0);
    try {
      const r = await downloadFile(
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        'dummy.pdf',
        setDownloadProgress
      );
      setStatus('Готово: файл сохранён в ' + r.uri);
    } catch (e) {
      setStatus('Ошибка скачивания');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Files</Text>
      <View style={{ paddingHorizontal: 16, width: '100%' }}>
        <Button title="Выбрать файл" onPress={pickFile} />
        <Text style={{ marginVertical: 8 }}>Статус: {status}</Text>
        {selectedFile?.name ? <Text>Выбран: {selectedFile.name}</Text> : null}
        <Text style={{ marginTop: 8 }}>Прогресс отправки: {uploadProgress}%</Text>
        <Button title="Отправить" onPress={upload} />
        <Text style={{ marginTop: 8 }}>Прогресс скачивания: {downloadProgress}%</Text>
        <Button title="Скачать пример PDF" onPress={download} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 24 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
});