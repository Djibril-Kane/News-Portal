'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

const mockArticlesDetails: Record<number, any> = {
  1: { title: "Lancement de la nouvelle plateforme à l'ESP", category: "Éducation", date: "2026-07-05", content: "Les étudiants de Master 1 de l'ESP ont débuté le développement d'un système d'information complet. Le projet met en œuvre une architecture découplée utilisant Spring Boot pour la robustesse du backend et Next.js pour une expérience utilisateur moderne et fluide côté frontend." },
  2: { title: "Les tendances du Web en 2026", category: "Technologie", date: "2026-07-04", content: "En 2026, l'adoption des architectures basées sur les API REST et SOAP reste une compétence fondamentale. Ce projet d'école démontre l'importance de savoir faire communiquer des technologies hétérogènes (Java et JavaScript/TypeScript) de manière totalement transparente." },
  3: { title: "Guide de survie en Architecture Logicielle", category: "Conseils", date: "2026-07-01", content: "Travailler à trois sur un projet d'architecture logicielle demande une organisation rigoureuse. La clé du succès réside dans une répartition claire des tâches, une communication quotidienne et l'utilisation stricte des branches Git pour éviter les conflits de code." }
};

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const articleId = Number(params.id);
  const article = mockArticlesDetails[articleId];

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Article introuvable</h2>
        <button onClick={() => router.push('/')} className="mt-4 text-blue-600 hover:underline">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <button 
        onClick={() => router.push('/')} 
        className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        ← Retour aux articles
      </button>

      <article>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {article.category}
        </span>
        <h1 className="text-3xl font-bold mt-3 mb-2 text-gray-900">
          {article.title}
        </h1>
        <div className="text-xs text-gray-400 mb-6">
          Publié le {article.date}
        </div>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {article.content}
        </p>
      </article>
    </main>
  );
}