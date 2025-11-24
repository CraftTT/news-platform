import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';
import type { PagedResponse } from '../types/news';

const BASE_URL = 'https://newsapi.org/v2';

function getApiKey() {
  const fromExtra = (Constants.expoConfig as any)?.extra?.NEWS_API_KEY ?? (Constants.manifest as any)?.extra?.NEWS_API_KEY;
  const fromEnv = process.env.NEWS_API_KEY;
  return fromExtra || fromEnv || '';
}

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const key = getApiKey();
      if (key) headers.set('X-Api-Key', key);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Top headlines (supports category)
    getTopHeadlines: builder.query<
      PagedResponse,
      { page?: number; pageSize?: number; q?: string; category?: string; country?: string }
    >({
      query: ({ page = 1, pageSize = 20, q, category, country = 'us' }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        params.set('country', country);
        if (q) params.set('q', q);
        if (category) params.set('category', category);
        return { url: `top-headlines?${params.toString()}` };
      },
    }),

    // Everything (supports q and date range)
    getEverything: builder.query<
      PagedResponse,
      { page?: number; pageSize?: number; q?: string; from?: string; to?: string; sortBy?: 'publishedAt' | 'relevancy' | 'popularity' }
    >({
      query: ({ page = 1, pageSize = 20, q, from, to, sortBy = 'publishedAt' }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        params.set('sortBy', sortBy);
        if (q) params.set('q', q);
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        return { url: `everything?${params.toString()}` };
      },
    }),
  }),
});

export const {
  useGetTopHeadlinesQuery,
  useLazyGetTopHeadlinesQuery,
  useGetEverythingQuery,
  useLazyGetEverythingQuery,
} = newsApi;