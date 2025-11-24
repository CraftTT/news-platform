export type Source = {
  id: string | null;
  name: string;
};

export type Article = {
  source: Source;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

export type PagedResponse = {
  status: 'ok' | 'error';
  totalResults: number;
  articles: Article[];
};