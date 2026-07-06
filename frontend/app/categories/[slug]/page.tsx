'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const allMockArticles = [
  { id: 1, title: "Lancement de la nouvelle plateforme à l'ESP", summary: "Les étudiants de Master 1 se lancent dans un projet d'architecture logicielle d'envergure.", category: "Education", date: "2026-07-05" },
  { id: 2, title: "Les tendances du Web en 2026", summary: "Découvrez pourquoi Next.js et la séparation stricte du backend restent incontournables.", category: "Technologie", date: "2026-07-04" },
  { id: 3, title: "Guide de survie en Architecture Logicielle", summary: "Comment mener à bien un projet de groupe à 3 sans perdre le contrôle de Git.", category: "Conseils", date: "2026-07-01" },
  { id: 4, title: "L'essor de l'IA dans l'enseignement supérieur", summary: "Analyse de l'intégration des outils d'IA au sein des laboratoires de recherche.", category: "Education", date: "2026-06-28" }
];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  
  const categorySlug = decodeURIComponent(params.slug as string);

  const filteredArticles = allMockArticles.filter(
    (article) => article.category.toLowerCase() === categorySlug.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <main className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => router.push('/')} 
          className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Retour à l'accueil
        </button>

        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
          Catégorie : <span className="text-blue-600 capitalize">{categorySlug}</span>
        </h1>

        <div className="space-y-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <article key={article.id} className="p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
                <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                  <Link href={`/articles/${article.id}`}>
                    {article.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mt-2">
                  {article.summary}
                </p>
                <div className="text-xs text-gray-400 mt-4">
                  Publié le {article.date}
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Aucun article trouvé pour cette catégorie.</p>
          )}
        </div>
      </main>
    </div>
  );
}