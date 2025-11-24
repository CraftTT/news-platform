import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '../../shared/types/news';
import { loadFavorites as loadFromStorage, saveFavorites } from '../../shared/storage/favoritesStorage';

export type FavoritesState = {
  items: Article[];
  hydrated: boolean;
};

const initialState: FavoritesState = {
  items: [],
  hydrated: false,
};

export const hydrateFavorites = createAsyncThunk('favorites/hydrate', async () => {
  const items = await loadFromStorage();
  return items;
});

export const addFavoriteAsync = createAsyncThunk(
  'favorites/add',
  async (article: Article, { getState }) => {
    const state = getState() as any;
    const existing: Article[] = state.favorites?.items ?? [];
    const next = existing.some((a) => a.url === article.url)
      ? existing
      : [article, ...existing];
    await saveFavorites(next);
    return article;
  }
);

export const removeFavoriteAsync = createAsyncThunk(
  'favorites/remove',
  async (url: string, { getState }) => {
    const state = getState() as any;
    const existing: Article[] = state.favorites?.items ?? [];
    const next = existing.filter((a) => a.url !== url);
    await saveFavorites(next);
    return url;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hydrateFavorites.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.items = action.payload ?? [];
        state.hydrated = true;
      })
      .addCase(addFavoriteAsync.fulfilled, (state, action: PayloadAction<Article>) => {
        const exists = state.items.some((a) => a.url === action.payload.url);
        if (!exists) state.items.unshift(action.payload);
      })
      .addCase(removeFavoriteAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((a) => a.url !== action.payload);
      });
  },
});

export default favoritesSlice.reducer;