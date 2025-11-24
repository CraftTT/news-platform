import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import ErrorState from '../../shared/ui/ErrorState';
import EmptyState from '../../shared/ui/EmptyState';
import {
  useLazyGetTopHeadlinesQuery,
  useLazyGetEverythingQuery,
} from '../../shared/api/newsApi';
import type { Article } from '../../shared/types/news';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../app/navigation/RootNavigator';

// Доступные категории новостей
const CATEGORIES = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

/**
 * Главный экран со списком новостей
 * Поддерживает поиск, фильтрацию по категориям и датам, бесконечную прокрутку
 */
export default function NewsListScreen() {
  const navigation = useNavigation<Nav>();
  
  // Состояние фильтров
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);

  // Состояние данных и пагинации
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // API хуки для загрузки новостей
  const [triggerTop, topState] = useLazyGetTopHeadlinesQuery();
  const [triggerEverything, everythingState] = useLazyGetEverythingQuery();

  const isFetching = topState.isFetching || everythingState.isFetching;
  const isInitialLoading = isFetching && page === 1 && articles.length === 0;
  const hasMore = useMemo(() => articles.length < totalResults, [articles.length, totalResults]);

  // Дебаунс для поиска - ждем 400мс после ввода перед запросом
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Формируем параметры запроса на основе текущих фильтров
  const buildParams = useCallback(
    (nextPage: number) => ({
      page: nextPage,
      pageSize: 20,
      q: debouncedSearch || undefined,
      category: category || undefined,
      from: from || undefined,
      to: to || undefined,
    }),
    [debouncedSearch, category, from, to]
  );

  const fetchPage = useCallback(
    async (nextPage: number, reset: boolean) => {
      try {
        setErrorMsg(null);
        const params = buildParams(nextPage);
        // Используем top-headlines по умолчанию (не требует обязательных параметров)
        // everything используем только если есть поисковый запрос или даты
        const useEverything = !params.category && (params.q || params.from || params.to);
        const result = useEverything 
          ? await triggerEverything(params).unwrap() 
          : await triggerTop(params).unwrap();
        setTotalResults(result.totalResults || 0);
        setArticles((prev) => (reset ? result.articles : [...prev, ...result.articles]));
        setPage(nextPage);
      } catch (err: any) {
        setErrorMsg(err?.data?.message || 'Не удалось загрузить новости');
      }
    },
    [buildParams, triggerTop, triggerEverything]
  );

  // Initial and filters change
  useEffect(() => {
    fetchPage(1, true);
  }, [debouncedSearch, category, from, to, fetchPage]);

  const onEndReached = useCallback(() => {
    if (!isFetching && hasMore) {
      fetchPage(page + 1, false);
    }
  }, [isFetching, hasMore, page, fetchPage]);

  const renderItem = useCallback(({ item }: { item: Article }) => {
    const openDetails = () => navigation.navigate('ArticleDetails', { article: item });
    return (
      <TouchableOpacity style={styles.card} onPress={openDetails}>
        {item.urlToImage ? (
          <Image source={{ uri: item.urlToImage }} style={styles.image} />
        ) : null}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.source?.name} • {new Date(item.publishedAt).toLocaleString()}
        </Text>
        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = useCallback((item: Article, index: number) => item.url ?? String(index), []);

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        placeholder="🔍 Найти новости по ключевым словам..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
        autoCapitalize="none"
        placeholderTextColor="#94a3b8"
      />

      {/* Date filters (YYYY-MM-DD) */}
      <View style={styles.filtersRow}>
        <TextInput
          placeholder="📅 Дата начала (2024-01-01)"
          value={from || ''}
          onChangeText={(v) => setFrom(v || undefined)}
          style={[styles.input, styles.inputSmall]}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          placeholder="📅 Дата окончания (2024-12-31)"
          value={to || ''}
          onChangeText={(v) => setTo(v || undefined)}
          style={[styles.input, styles.inputSmall]}
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Category chips */}
      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, !category && styles.chipActive]}
          onPress={() => setCategory(null)}
        >
          <Text style={styles.chipText}>All</Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={styles.chipText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error state */}
      {errorMsg ? <ErrorState message={errorMsg} onRetry={() => fetchPage(1, true)} /> : null}

      {/* List */}
      {isInitialLoading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator />
        </View>
      ) : articles.length === 0 ? (
        <EmptyState title="Нет новостей" subtitle="Измените фильтры или попробуйте позже" />
      ) : (
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.6}
          onEndReached={onEndReached}
          ListFooterComponent={isFetching && articles.length > 0 ? <ActivityIndicator style={{ margin: 12 }} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12, paddingTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  inputSmall: { flex: 1 },
  filtersRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  chipActive: { backgroundColor: '#e0f0ff', borderColor: '#87ceeb' },
  chipText: { fontSize: 13 },
  errorBox: { padding: 10, borderRadius: 8, backgroundColor: '#ffecec', borderWidth: 1, borderColor: '#ffb3b3' },
  errorText: { color: '#c00', marginBottom: 8 },
  retryBtn: { paddingHorizontal: 10, paddingVertical: 8, alignSelf: 'flex-start', backgroundColor: '#e0f0ff', borderRadius: 6 },
  retryText: { color: '#0366d6' },
  loaderBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingBottom: 20 },
  card: { marginBottom: 12, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, backgroundColor: '#fff' },
  image: { width: '100%', height: 160, borderRadius: 6, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  meta: { fontSize: 12, color: '#666', marginBottom: 6 },
  desc: { fontSize: 14, color: '#333' },
});