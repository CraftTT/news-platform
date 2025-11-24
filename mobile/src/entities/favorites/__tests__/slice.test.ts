import reducer, { addFavoriteAsync, removeFavoriteAsync, hydrateFavorites } from '../slice';
import type { Article } from '../../../shared/types/news';

const sample: Article = {
  source: { id: null, name: 'Example' },
  author: 'Author',
  title: 'Sample title',
  description: 'Desc',
  url: 'https://example.com/a',
  urlToImage: null,
  publishedAt: '2024-01-01T00:00:00Z',
  content: null,
};

describe('favorites slice', () => {
  it('hydrates favorites into state', () => {
    const state = reducer(undefined, hydrateFavorites.fulfilled([sample], 'req'));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].url).toBe(sample.url);
  });

  it('adds favorite', () => {
    const s1 = reducer(undefined, { type: '@@INIT' });
    const s2 = reducer(s1, addFavoriteAsync.fulfilled(sample, 'req', sample));
    expect(s2.items.find((a) => a.url === sample.url)).toBeTruthy();
  });

  it('removes favorite', () => {
    const s1 = reducer(undefined, addFavoriteAsync.fulfilled(sample, 'req', sample));
    const s2 = reducer(s1, removeFavoriteAsync.fulfilled('https://example.com/a', 'req', 'https://example.com/a'));
    expect(s2.items.find((a) => a.url === sample.url)).toBeFalsy();
  });
});