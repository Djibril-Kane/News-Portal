'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { ArticleCard } from '@/components/ArticleCard';
import { articleService, Article } from '@/services/articleService';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = decodeURIComponent(params.slug as string);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    articleService
      .getByCategoryName(categorySlug)
      .then((data) => {
        if (!cancelled) setArticles(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Impossible de charger les articles');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-8">
          Catégorie : <span className="text-blue-600 capitalize">{categorySlug}</span>
        </h1>

        {loading && <p className="text-gray-500">Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-16">Aucun article trouvé pour cette catégorie.</p>
          )
        )}
      </main>
    </div>
  );
}
