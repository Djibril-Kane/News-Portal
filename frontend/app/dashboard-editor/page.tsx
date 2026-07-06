'use client';

import React, { useState } from 'react';

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
}

const initialArticles: Article[] = [
  { id: 1, title: "Lancement de la nouvelle plateforme à l'ESP", summary: "Les étudiants de Master 1 se lancent dans un projet d'architecture logicielle.", category: "Éducation" },
  { id: 2, title: "Les tendances du Web en 2026", summary: "Découvrez pourquoi Next.js reste incontournable.", category: "Technologie" }
];

export default function EditorDashboard() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Éducation');

  // Ajouter un nouvel article (Create)
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) return;

    const newArticle: Article = {
      id: Date.now(),
      title,
      summary,
      category
    };

    setArticles([...articles, newArticle]);
    setTitle('');
    setSummary('');
  };

  // Supprimer un article (Delete)
  const handleDeleteArticle = (id: number) => {
    setArticles(articles.filter(art => art.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
          Espace Éditeur — Gestion des Actualités
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire d'ajout */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Ajouter un article</h2>
            <form onSubmit={handleAddArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Titre de l'article"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Éducation">Éducation</option>
                  <option value="Technologie">Technologie</option>
                  <option value="Conseils">Conseils</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Résumé de l'article..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Publier l'article
              </button>
            </form>
          </div>

          {/* Liste de gestion */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Articles en ligne ({articles.length})</h2>
            <div className="space-y-4">
              {articles.map((art) => (
                <div key={art.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-start bg-gray-50">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {art.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{art.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{art.summary}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteArticle(art.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}