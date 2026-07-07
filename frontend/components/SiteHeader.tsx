'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { categoryService, Category } from '@/services/categoryService';

export function SiteHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900 shrink-0">
          News Portal
        </Link>

        <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium overflow-x-auto">
          <Link
            href="/"
            className={`transition ${pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Accueil
          </Link>
          {categories.map((cat) => {
            const href = `/categories/${encodeURIComponent(cat.nom)}`;
            const active = pathname === href;
            return (
              <Link
                key={cat.id}
                href={href}
                className={`whitespace-nowrap transition ${active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {cat.nom}
              </Link>
            );
          })}
        </nav>

        {/* pas de lien "Connexion" pour un visiteur : la page /login n'est pas censee
            etre decouvrable depuis la navigation publique, seuls editeurs/admins la connaissent */}
        <nav className="flex items-center justify-end gap-8 text-sm font-medium shrink-0">
          {user && user.role === 'EDITEURS' && (
            <Link href="/dashboard-editor" className="text-gray-600 hover:text-gray-900 transition">
              Espace éditeur
            </Link>
          )}
          {user && user.role === 'ADMINS' && (
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition">
              Espace admin
            </Link>
          )}
          {user && (
            <button onClick={logout} className="cursor-pointer text-gray-500 hover:text-red-600 transition">
              Déconnexion
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
