'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';

const mockPages: Record<number, any[]> = {
  1: [
    { id: 1, title: "Lancement de la nouvelle plateforme à l'ESP", summary: "Les étudiants de Master 1 se lancent dans un projet d'architecture logicielle d'envergure.", category: "Éducation", date: "2026-07-05" },
    { id: 2, title: "Les tendances du Web en 2026", summary: "Découvrez pourquoi Next.js et la séparation stricte du backend restent incontournables.", category: "Technologie", date: "2026-07-04" }
  ],
  2: [
    { id: 3, title: "Guide de survie en Architecture Logicielle", summary: "Comment mener à bien un projet de groupe à 3 sans perdre le contrôle de Git.", category: "Conseils", date: "2026-07-01" }
  ]
};

export default function HomePage() {
  // Gestion de l'état de la page actuelle
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  // Récupération des articles de la page en cours
  const articles = mockPages[currentPage] || [];

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Site d'Actualités
      </h1>
      
      {/* Liste des articles dynamique */}
      <div className="space-y-6">
        {articles.map((article) => (
          <article key={article.id} className="p-5 border rounded-lg shadow-sm hover:shadow-md transition">
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {article.category}
            </span>
            <h2 className="text-xl font-bold mt-2 text-gray-900 cursor-pointer hover:text-blue-600">
              <Link href={`/articles/${article.id}`}></Link>
              {article.title}
            </h2>
            <p className="text-gray-600 mt-2">
              {article.summary}
            </p>
            <div className="text-xs text-gray-400 mt-4">
              Publié le {article.date}
            </div>
          </article>
        ))}
      </div>

      {/* Pagination fonctionnelle */}
      <div className="flex justify-between items-center mt-8">
        <button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        
        <span className="text-sm text-gray-600">
          Page {currentPage} sur {totalPages}
        </span>
        
        <button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </main>
  );
}