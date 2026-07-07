import React from 'react';
import Link from 'next/link';
import { Article } from '@/services/articleService';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition">
      <div className="p-8 flex flex-col flex-1">
        <span className="self-start text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          {article.categoryNom}
        </span>

        <h2 className="text-xl font-bold mt-4 text-gray-900 group-hover:text-blue-600 transition">
          <Link href={`/articles/${article.id}`}>
            <span className="absolute inset-0" />
            {article.titre}
          </Link>
        </h2>

        <p className="text-gray-600 text-sm mt-3 line-clamp-6 flex-1 min-h-[7.5rem]">
          {article.resume}
        </p>

        <div className="text-xs text-gray-400 mt-6">
          Publié le {new Date(article.datePublication).toLocaleDateString('fr-FR')}
        </div>
      </div>
    </article>
  );
}
