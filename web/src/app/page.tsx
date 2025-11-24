'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLazyGetTopHeadlinesQuery, useLazyGetEverythingQuery } from '../shared/api/newsApi';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { addFavorite, removeFavorite } from '../entities/favorites/slice';
import type { Article } from '../shared/types/news';
import NewsCard from '../shared/ui/NewsCard';
import ErrorState from '../shared/ui/ErrorState';
import EmptyState from '../shared/ui/EmptyState';
import Link from 'next/link';

// Доступные категории новостей для фильтрации
const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

export default function Home() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  
  // Состояние для фильтров и поиска
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  
  // Состояние для пагинации и данных
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Хуки для ленивой загрузки данных из API
  const [triggerTop, topState] = useLazyGetTopHeadlinesQuery();
  const [triggerEverything, everythingState] = useLazyGetEverythingQuery();

  // Проверяем, находится ли статья в избранном
  const isFavorite = (url: string) => favorites.some((fav) => fav.url === url);
  
  // Добавляем или удаляем статью из избранного
  const toggleFavorite = (article: Article) => {
    if (isFavorite(article.url)) {
      dispatch(removeFavorite(article.url));
    } else {
      dispatch(addFavorite(article));
    }
  };

  const isFetching = topState.isFetching || everythingState.isFetching;
  const isInitialLoading = isFetching && page === 1 && articles.length === 0;

  // Дебаунс для поиска - ждем 400мс после последнего ввода перед запросом
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Загружаем страницу с новостями
  const fetchPage = useCallback(
    async (nextPage: number, reset: boolean) => {
      try {
        setErrorMsg(null);
        const params = {
          page: nextPage,
          pageSize: 20,
          q: debouncedSearch || undefined,
          category: category || undefined,
          from: from || undefined,
          to: to || undefined,
        };
        
        // Выбираем нужный endpoint в зависимости от фильтров
        // everything требует хотя бы один параметр, поэтому используем top-headlines по умолчанию
        const useEverything = !params.category && (params.q || params.from || params.to);
        const result = useEverything 
          ? await triggerEverything(params).unwrap() 
          : await triggerTop(params).unwrap();
        
        setTotalResults(result.totalResults || 0);
        // Если reset=true, заменяем все статьи, иначе добавляем к существующим
        setArticles((prev) => (reset ? result.articles : [...prev, ...result.articles]));
        setPage(nextPage);
      } catch (err: any) {
        setErrorMsg(err?.data?.message || 'Не удалось загрузить новости');
      }
    },
    [debouncedSearch, category, from, to, triggerTop, triggerEverything]
  );

  // Перезагружаем новости при изменении фильтров
  useEffect(() => {
    fetchPage(1, true);
  }, [debouncedSearch, category, from, to, fetchPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">📰 News Platform</h1>
              <p className="text-sm text-slate-500 mt-1">Актуальные новости со всего мира</p>
            </div>
            <Link href="/favorites" className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium">
              Избранное
            </Link>
          </div>
          
          <input
            type="text"
            placeholder="🔍 Найти новости по ключевым словам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Дата начала (2024-01-01)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Дата окончания (2024-12-31)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !category 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Все
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  category === cat 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {errorMsg && <ErrorState message={errorMsg} onRetry={() => fetchPage(1, true)} />}

        {isInitialLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : articles.length === 0 ? (
          <EmptyState title="Нет новостей" subtitle="Измените фильтры или попробуйте позже" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, idx) => (
                <div key={article.url || idx} className="relative">
                  <Link href={`/article?url=${encodeURIComponent(article.url)}`}>
                    <NewsCard article={article} onClick={() => {}} />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(article);
                    }}
                    className={`absolute top-2 right-2 px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all ${
                      isFavorite(article.url)
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                    }`}
                  >
                    {isFavorite(article.url) ? 'Сохранено' : 'Сохранить'}
                  </button>
                </div>
              ))}
            </div>

            {articles.length < totalResults && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchPage(page + 1, false)}
                  disabled={isFetching}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium"
                >
                  {isFetching ? '⏳ Загрузка...' : '📄 Загрузить еще'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
