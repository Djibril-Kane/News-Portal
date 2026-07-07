'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { articleService, generateResume, Article } from '@/services/articleService';
import { categoryService, Category } from '@/services/categoryService';

export default function ArticlesManagement() {
  const { user } = useAuth();
  const token = user!.token;

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const loadArticles = () => {
    articleService.getAll(0, 50).then((data) => setArticles(data.content)).catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadArticles();
    categoryService.getAll().then(setCategories).catch((err) => setError(err.message));
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitre('');
    setContenu('');
    setCategoryName('');
    setShowForm(false);
  };

  const handleNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setTitre(article.titre);
    setContenu(article.contenu);
    setCategoryName(article.categoryNom);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await articleService.delete(token, id);
      loadArticles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Resout le nom de categorie saisi vers un id : reutilise la categorie existante
  // (comparaison insensible a la casse) ou la cree a la volee si elle n'existe pas encore
  const resolveCategoryId = async (nom: string): Promise<number> => {
    const trimmed = nom.trim();
    const existing = categories.find((cat) => cat.nom.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing.id;

    const created = await categoryService.create(token, { nom: trimmed, description: '' });
    setCategories((prev) => [...prev, created]);
    return created.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre || !contenu || !categoryName.trim()) return;

    try {
      const categoryId = await resolveCategoryId(categoryName);
      const input = { titre, resume: generateResume(contenu), contenu, categoryId };
      if (editingId) {
        await articleService.update(token, editingId, input);
      } else {
        await articleService.create(token, input);
      }
      resetForm();
      loadArticles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gestion des Articles</h2>
          <p className="text-sm text-gray-500">Modérez les publications et gérez le contenu du News-Portal.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleNew} className="cursor-pointer bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Nouvel Article
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">{editingId ? "Modifier l'article" : 'Nouvel article'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre"
              className="border border-gray-300 rounded-lg p-2"
            />
            <div>
              <input
                type="text"
                list="admin-category-options"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Catégorie (ex : Sport)"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <datalist id="admin-category-options">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.nom} />
                ))}
              </datalist>
              <p className="text-xs text-gray-400 mt-1">
                Catégorie existante ou nouvelle (créée automatiquement).
              </p>
            </div>
          </div>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Contenu"
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <p className="text-xs text-gray-400">
            Le résumé affiché sur l'accueil est généré automatiquement à partir du début du contenu.
          </p>
          <div className="flex gap-2">
            <button type="submit" className="cursor-pointer bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Enregistrer
            </button>
            <button type="button" onClick={resetForm} className="cursor-pointer border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Tableau des articles */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Titre de l'article</th>
                <th className="py-4 px-6">Catégorie</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-6 font-medium text-gray-900 max-w-md truncate">{article.titre}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                      {article.categoryNom}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{new Date(article.datePublication).toLocaleDateString('fr-FR')}</td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button onClick={() => handleEdit(article)} className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-950 transition">
                      Éditer
                    </button>
                    <button onClick={() => handleDelete(article.id)} className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700 transition">
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
