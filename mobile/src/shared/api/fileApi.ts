import * as FileSystem from 'expo-file-system';

export async function uploadFileMock(uri: string, onProgress?: (p: number) => void): Promise<{ success: boolean }> {
  // Мокаем отправку: просто прогресс бар 0..100 за ~2 сек
  return new Promise((resolve) => {
    let p = 0;
    const timer = setInterval(() => {
      p += 10;
      onProgress?.(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(timer);
        resolve({ success: true });
      }
    }, 200);
  });
}

export async function downloadFile(
  url: string,
  filename: string,
  onProgress?: (p: number) => void
): Promise<{ uri: string }> {
  const anyFS = FileSystem as any;
  const baseDir = anyFS.documentDirectory ?? anyFS.cacheDirectory ?? '';
  const target = baseDir ? `${baseDir}${filename}` : filename;
  const resumable = FileSystem.createDownloadResumable(
    url,
    target,
    {},
    (progress) => {
      const expected = progress.totalBytesExpectedToWrite ?? 0;
      const written = progress.totalBytesWritten ?? 0;
      const p = expected > 0 ? Math.round((written / expected) * 100) : 0;
      onProgress?.(p);
    }
  );
  const r = await resumable.downloadAsync();
  return { uri: r?.uri ?? target };
}