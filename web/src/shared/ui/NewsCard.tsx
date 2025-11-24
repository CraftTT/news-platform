import type { Article } from '../types/news';
import Image from 'next/image';

interface NewsCardProps {
  article: Article;
  onClick: () => void;
}

export default function NewsCard({ article, onClick }: NewsCardProps) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:scale-[1.02]"
    >
      {article.urlToImage && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-slate-800">{article.title}</h3>
      <p className="text-sm text-slate-500 mb-3 font-medium">
        {article.source?.name} • {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
      </p>
      {article.description && (
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{article.description}</p>
      )}
    </div>
  );
}
