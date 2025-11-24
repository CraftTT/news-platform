import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PagedResponse } from '../types/news';

const BASE_URL = 'https://newsapi.org/v2';
const API_KEY = '15af6f9244e74986b4550ecb4bcad36e';

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('X-Api-Key', API_KEY);
      return headers;
    },
  }),
  endpoints: (builder) => ({
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
