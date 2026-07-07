'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/context/AuthContext';
import { articleService, generateResume, Article } from '@/services/articleService';
import { categoryService, Category } from '@/services/categoryService';

function EditorDashboardContent() {
  const { user, logout } = useAuth();
  const token = user!.token;

  // rechargement complet plutot qu'un router.push : sinon RequireRole detecte
  // la deconnexion (user devient null) et gagne la course vers /login avant
  // que la navigation client-side vers "/" n'ait le temps de s'appliquer
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Formulaire article
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [categoryName, setCategoryName] = useState('');

  // Formulaire catégorie
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryNom, setCategoryNom] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const loadArticles = () => {
    articleService.getAll(0, 50).then((data) => setArticles(data.content)).catch((err) => setError(err.message));
  };

  const loadCategories = () => {
    categoryService.getAll().then(setCategories).catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, []);

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setTitre('');
    setContenu('');
    setCategoryName('');
  };

  // Resout le nom de categorie saisi vers un id : reutilise la categorie existante
  // (comparaison insensible a la casse) ou la cree a la volee si elle n'existe pas encore
  const resolveCategoryId = async (nom: string): Promise<number> => {
    const trimmed = nom.trim();
    const existing = categories.find((cat) => cat.nom.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing.id;

    const created = await categoryService.create(token, { nom: trimmed, description: '' });
    loadCategories();
    return created.id;
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre || !contenu || !categoryName.trim()) return;

    try {
      const categoryId = await resolveCategoryId(categoryName);
      const input = { titre, resume: generateResume(contenu), contenu, categoryId };
      if (editingArticleId) {
        await articleService.update(token, editingArticleId, input);
      } else {
        await articleService.create(token, input);
      }
      resetArticleForm();
      loadArticles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticleId(article.id);
    setTitre(article.titre);
    setContenu(article.contenu);
    setCategoryName(article.categoryNom);
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await articleService.delete(token, id);
      loadArticles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryNom('');
    setCategoryDescription('');
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNom) return;

    try {
      const input = { nom: categoryNom, description: categoryDescription };
      if (editingCategoryId) {
        await categoryService.update(token, editingCategoryId, input);
      } else {
        await categoryService.create(token, input);
      }
      resetCategoryForm();
      loadCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryNom(category.nom);
    setCategoryDescription(category.description ?? '');
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await categoryService.delete(token, id);
      loadCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-1">
              Espace Éditeur — Gestion des Actualités
            </h1>
          </div>
          <button onClick={handleLogout} className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800">
            Déconnexion
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingArticleId ? "Modifier l'article" : 'Ajouter un article'}
            </h2>
            <form onSubmit={handleSubmitArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Titre de l'article"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input
                  type="text"
                  list="editor-category-options"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex : Sport, Politique..."
                />
                <datalist id="editor-category-options">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.nom} />
                  ))}
                </datalist>
                <p className="text-xs text-gray-400 mt-1">
                  Choisissez une catégorie existante ou tapez-en une nouvelle : elle sera créée automatiquement.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  value={contenu}
                  onChange={(e) => setContenu(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contenu complet..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Le résumé affiché sur l'accueil est généré automatiquement à partir du début du contenu.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="cursor-pointer flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingArticleId ? 'Enregistrer' : "Publier l'article"}
                </button>
                {editingArticleId && (
                  <button type="button" onClick={resetArticleForm} className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Articles en ligne ({articles.length})</h2>
            <div className="space-y-4">
              {articles.map((art) => (
                <div key={art.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-start bg-gray-50">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {art.categoryNom}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{art.titre}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{art.resume}</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => handleEditArticle(art)}
                      className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Catégories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingCategoryId ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            </h2>
            <form onSubmit={handleSubmitCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={categoryNom}
                  onChange={(e) => setCategoryNom(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex : Technologie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Description de la catégorie..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="cursor-pointer flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingCategoryId ? 'Enregistrer' : 'Ajouter la catégorie'}
                </button>
                {editingCategoryId && (
                  <button type="button" onClick={resetCategoryForm} className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Catégories ({categories.length})</h2>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{cat.nom}</h3>
                    <p className="text-gray-600 text-sm">{cat.description}</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorDashboard() {
  return (
    <RequireRole roles={['EDITEURS', 'ADMINS']}>
      <EditorDashboardContent />
    </RequireRole>
  );
}
