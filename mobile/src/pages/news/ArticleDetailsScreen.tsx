import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../app/navigation/RootNavigator';
import type { Article } from '../../shared/types/news';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { addFavoriteAsync, removeFavoriteAsync } from '../../entities/favorites/slice';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ArticleDetails'>;

export default function ArticleDetailsScreen() {
  const route = useRoute() as any;
  const navigation = useNavigation<Nav>();
  const article = route.params?.article as Article;
  const dispatch = useAppDispatch();

  const isFavorite = useAppSelector((s) => s.favorites.items.some((a) => a.url === article?.url));

  const onToggleFavorite = () => {
    if (!article) return;
    if (isFavorite) dispatch(removeFavoriteAsync(article.url));
    else dispatch(addFavoriteAsync(article));
  };

  const onOpenOriginal = () => {
    if (article?.url) navigation.navigate('ArticleWebView', { url: article.url });
  };

  if (!article) {
    return (
      <View style={styles.empty}>
        <Text>Статья не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {article.urlToImage ? (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.meta}>
        {article.source?.name}
        {article.author ? ` • ${article.author}` : ''}
        {article.publishedAt ? ` • ${new Date(article.publishedAt).toLocaleString()}` : ''}
      </Text>
      {article.description ? <Text style={styles.desc}>{article.description}</Text> : null}
      {article.content ? <Text style={styles.content}>{article.content}</Text> : null}

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.btn, isFavorite ? styles.btnRemove : styles.btnAdd]} onPress={onToggleFavorite}>
          <Text style={styles.btnText}>{isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnOpen]} onPress={onOpenOriginal}>
          <Text style={styles.btnText}>Открыть полностью</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16 },
  image: { width: '100%', height: 220, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  meta: { fontSize: 12, color: '#666', marginBottom: 8 },
  desc: { fontSize: 14, color: '#333', marginBottom: 8 },
  content: { fontSize: 14, color: '#333', marginBottom: 12 },
  buttonsRow: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnAdd: { backgroundColor: '#e0f7e9' },
  btnRemove: { backgroundColor: '#ffecec' },
  btnOpen: { backgroundColor: '#e0f0ff' },
  btnText: { color: '#111', fontWeight: '600' },
});