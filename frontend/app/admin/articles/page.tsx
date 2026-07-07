import React from 'react';

const mockArticles = [
  { id: 1, title: "L'intelligence artificielle transforme le développement web", author: "Djibril Kane", category: "Technologie", date: "06 Juillet 2026", status: "Publié" },
  { id: 2, title: "Les nouvelles régulations environnementales à Dakar", author: "Fatou Fall", category: "Actualité", date: "05 Juillet 2026", status: "En attente" },
  { id: 3, title: "Guide complet pour maîtriser Next.js et Tailwind CSS", author: "Moussa Diop", category: "Tutoriel", date: "01 Juillet 2026", status: "Publié" },
];

export default function ArticlesManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gestion des Articles</h2>
          <p className="text-sm text-gray-500">Modérez les publications, validez les brouillons et gérez le contenu du News-Portal.</p>
        </div>
        <div className="flex gap-3">
          <button className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            Filtrer
          </button>
          <button className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Nouvel Article
          </button>
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Titre de l'article</th>
                <th className="py-4 px-6">Auteur</th>
                <th className="py-4 px-6">Catégorie</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Statut</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {mockArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-6 font-medium text-gray-900 max-w-md truncate">{article.title}</td>
                  <td className="py-4 px-6 text-gray-500">{article.author}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                      {article.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{article.date}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.status === 'Publié' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-950 transition">
                      Éditer
                    </button>
                    <button className="text-sm font-medium text-red-600 hover:text-red-700 transition">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}