import { configureStore } from '@reduxjs/toolkit';
import { newsApi } from '../../shared/api/newsApi';
import favoritesReducer from '../../entities/favorites/slice';

export const store = configureStore({
  reducer: {
    [newsApi.reducerPath]: newsApi.reducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
