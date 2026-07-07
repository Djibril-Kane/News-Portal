'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { articleService, Article } from '@/services/articleService';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = Number(params.id);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    articleService
      .getById(articleId)
      .then((data) => {
        if (!cancelled) setArticle(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← Retour aux articles
        </Link>

        {loading && <p className="text-gray-500 mt-6">Chargement de l'article...</p>}

        {!loading && (notFound || !article) && (
          <div className="text-center py-16">
            <h2 className="text-xl font-bold text-red-600">Article introuvable</h2>
          </div>
        )}

        {!loading && article && (
          <article className="mt-6">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {article.categoryNom}
            </span>
            <h1 className="text-3xl font-bold mt-4 mb-2 text-gray-900 leading-tight">
              {article.titre}
            </h1>
            <div className="text-sm text-gray-400 mb-8">
              Publié le {new Date(article.datePublication).toLocaleDateString('fr-FR')}
            </div>
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {article.contenu}
            </p>
          </article>
        )}
      </main>
    </div>
  );
}
