'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { articleService } from '@/services/articleService';
import { categoryService } from '@/services/categoryService';
import { userService } from '@/services/userService';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [articlesCount, setArticlesCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    articleService.getAll(0, 1).then((data) => setArticlesCount(data.totalElements)).catch(() => setArticlesCount(null));
    categoryService.getAll().then((data) => setCategoriesCount(data.length)).catch(() => setCategoriesCount(null));
    userService.getAllUsers(user.token).then((data) => setUsersCount(data.length)).catch(() => setUsersCount(null));
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Vue d'ensemble</h2>
        <p className="text-sm text-gray-500">Bienvenue sur votre espace d'administration.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-sm font-medium text-gray-400">Articles Total</span>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">{articlesCount ?? '—'}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-sm font-medium text-gray-400">Utilisateurs</span>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">{usersCount ?? '—'}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-sm font-medium text-gray-400">Catégories</span>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">{categoriesCount ?? '—'}</h3>
        </div>
      </div>
    </div>
  );
}
