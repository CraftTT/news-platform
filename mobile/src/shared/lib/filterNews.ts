import type { Article } from '../types/news';

export type FilterParams = {
  query?: string;
  sourceName?: string;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
};

function inRange(publishedAt: string, from?: string, to?: string) {
  const ts = Date.parse(publishedAt);
  if (Number.isNaN(ts)) return false;
  const fromTs = from ? Date.parse(from) : undefined;
  const toTs = to ? Date.parse(to) : undefined;
  if (fromTs && ts < fromTs) return false;
  if (toTs && ts > toTs) return false;
  return true;
}

export function filterNews(articles: Article[], params: FilterParams): Article[] {
  const q = params.query?.trim().toLowerCase();
  const src = params.sourceName?.trim().toLowerCase();
  return articles.filter((a) => {
    const matchesQuery = q
      ? (a.title?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q))
      : true;
    const matchesSource = src ? a.source?.name?.toLowerCase() === src : true;
    const matchesDate = inRange(a.publishedAt, params.from, params.to);
    return matchesQuery && matchesSource && matchesDate;
  });
}