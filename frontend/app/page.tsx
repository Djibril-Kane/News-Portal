'use client';

import React, { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { ArticleCard } from '@/components/ArticleCard';
import { articleService, Article } from '@/services/articleService';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    articleService
      .getAll(currentPage, 3)
      .then((data) => {
        if (cancelled) return;
        setArticles(data.content);
        setTotalPages(Math.max(data.totalPages, 1));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Impossible de charger les articles');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Dernières actualités
        </h1>

        {loading && <p className="text-gray-500">Chargement des articles...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            {articles.length === 0 ? (
              <p className="text-gray-500 text-center py-16">Aucun article publié pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition"
                disabled={currentPage === 0}
              >
                ← Précédent
              </button>

              <span className="text-sm text-gray-500">
                Page {currentPage + 1} sur {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                className="cursor-pointer px-4 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                disabled={currentPage >= totalPages - 1}
              >
                Suivant →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
