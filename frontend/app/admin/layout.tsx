'use client';

import React from 'react';
import Link from 'next/link';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  // rechargement complet plutot qu'un router.push : sinon RequireRole detecte
  // la deconnexion (user devient null) et gagne la course vers /login avant
  // que la navigation client-side vers "/" n'ait le temps de s'appliquer
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <RequireRole roles={['ADMINS']}>
      <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6">
          <div>
            <div className="mb-10 px-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">News Portal</h1>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Espace Admin</span>
            </div>

            <nav className="space-y-1">
              <Link href="/admin" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition">
                Vue d'ensemble
              </Link>
              <Link href="/admin/articles" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition">
                Gestion Articles
              </Link>
              <Link href="/admin/users" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition">
                Utilisateurs & Droits
              </Link>
              <Link href="/admin/tokens" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition">
                Jetons d'authentification
              </Link>
            </nav>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-1">
            <Link href="/" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition">
              ← Retour à l'accueil
            </Link>
            <button onClick={handleLogout} className="cursor-pointer w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
              Déconnexion
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
            <div className="text-sm font-medium text-gray-500">Tableau de bord</div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                {user ? `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() : 'AD'}
              </div>
            </div>
          </header>

          <main className="p-8 flex-1 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </RequireRole>
  );
}