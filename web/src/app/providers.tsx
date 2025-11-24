'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { useEffect } from 'react';
import { hydrateFavorites } from '../entities/favorites/slice';

/**
 * Провайдер Redux для всего приложения
 * При монтировании восстанавливает избранное из localStorage
 */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Загружаем сохраненные избранные статьи из localStorage при старте приложения
    store.dispatch(hydrateFavorites());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
