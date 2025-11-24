'use client';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeFavorite } from '../../entities/favorites/slice';
import NewsCard from '../../shared/ui/NewsCard';
import EmptyState from '../../shared/ui/EmptyState';
import Link from 'next/link';

export default function FavoritesPage() {
  const favorites = useAppSelector((state) => state.favorites.items);
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Избранное</h1>
              <p className="text-sm text-slate-500 mt-1">Ваши сохраненные статьи</p>
            </div>
            <Link href="/" className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium">
              Новости
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <EmptyState title="Нет избранных статей" subtitle="Добавьте статьи в избранное на главной странице" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((article, idx) => (
              <div key={article.url || idx} className="relative">
                <Link href={`/article?url=${encodeURIComponent(article.url)}`}>
                  <NewsCard article={article} onClick={() => {}} />
                </Link>
                <button
                  onClick={() => dispatch(removeFavorite(article.url))}
                  className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
