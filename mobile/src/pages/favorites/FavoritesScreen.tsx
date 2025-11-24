import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import EmptyState from '../../shared/ui/EmptyState';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { removeFavoriteAsync } from '../../entities/favorites/slice';
import type { Article } from '../../shared/types/news';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../app/navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.favorites.items);

  const renderItem = useCallback(({ item }: { item: Article }) => {
    const openDetails = () => navigation.navigate('ArticleDetails', { article: item });
    const onRemove = () => dispatch(removeFavoriteAsync(item.url));
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={openDetails} style={{ flex: 1 }}>
          {item.urlToImage ? <Image source={{ uri: item.urlToImage }} style={styles.image} /> : null}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.source?.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
          <Text style={styles.removeText}>Удалить</Text>
        </TouchableOpacity>
      </View>
    );
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <EmptyState title="Нет избранных статей" subtitle="Добавьте статьи из ленты новостей" />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.url}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', padding: 12, marginHorizontal: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, backgroundColor: '#fff' },
  image: { width: 80, height: 80, borderRadius: 6, marginBottom: 8 },
  title: { fontSize: 14, fontWeight: '600' },
  meta: { fontSize: 12, color: '#666', marginTop: 4 },
  removeBtn: { alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#ffecec', borderRadius: 6, marginLeft: 8 },
  removeText: { color: '#c00' },
});