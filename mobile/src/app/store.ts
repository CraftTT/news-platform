import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import appReducer from './slices/appSlice';
import { newsApi } from '../shared/api/newsApi';
import favoritesReducer from '../entities/favorites/slice';
import authReducer from '../entities/auth/slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    [newsApi.reducerPath]: newsApi.reducer,
    favorites: favoritesReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
