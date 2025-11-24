import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '../../shared/types/news';

interface FavoritesState {
  items: Article[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Article>) => {
      const exists = state.items.find((item) => item.url === action.payload.url);
      if (!exists) {
        state.items.push(action.payload);
        if (typeof window !== 'undefined') {
          localStorage.setItem('favorites', JSON.stringify(state.items));
        }
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.url !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state.items));
      }
    },
    hydrateFavorites: (state) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('favorites');
        if (stored) {
          try {
            state.items = JSON.parse(stored);
          } catch (e) {
            state.items = [];
          }
        }
      }
    },
  },
});

export const { addFavorite, removeFavorite, hydrateFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
