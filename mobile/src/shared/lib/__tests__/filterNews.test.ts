import { filterNews } from '../filterNews';
import type { Article } from '../../types/news';

const mk = (over: Partial<Article> = {}): Article => ({
  source: { id: null, name: 'Src' },
  author: null,
  title: 'Hello world',
  description: 'Desc',
  url: Math.random().toString(36),
  urlToImage: null,
  publishedAt: '2024-01-01T00:00:00Z',
  content: null,
  ...over,
});

describe('filterNews', () => {
  const items: Article[] = [
    mk({ title: 'Hello AI', source: { id: null, name: 'Tech' }, publishedAt: '2024-01-10T00:00:00Z' }),
    mk({ title: 'Sports daily', source: { id: null, name: 'Sports' }, publishedAt: '2024-01-05T00:00:00Z' }),
    mk({ title: 'Finance news', source: { id: null, name: 'Business' }, description: 'markets', publishedAt: '2024-01-02T00:00:00Z' }),
  ];

  it('filters by query in title', () => {
    const res = filterNews(items, { query: 'AI' });
    expect(res).toHaveLength(1);
    expect(res[0].title).toContain('AI');
  });

  it('filters by source name', () => {
    const res = filterNews(items, { sourceName: 'sports' });
    expect(res).toHaveLength(1);
    expect(res[0].source.name).toBe('Sports');
  });

  it('filters by date range', () => {
    const res = filterNews(items, { from: '2024-01-03', to: '2024-01-09' });
    expect(res.map((x) => x.title)).toEqual(['Sports daily']);
  });

  it('filters by description when title does not match', () => {
    const res = filterNews(items, { query: 'market' });
    expect(res.map((x) => x.title)).toEqual(['Finance news']);
  });
});