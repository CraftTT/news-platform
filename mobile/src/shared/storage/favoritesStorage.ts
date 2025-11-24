import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Article } from '../types/news';

const KEY = 'favorites_articles_v1';

export async function loadFavorites(): Promise<Article[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Article[];
    return [];
  } catch {
    return [];
  }
}

export async function saveFavorites(items: Article[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // noop
  }
}