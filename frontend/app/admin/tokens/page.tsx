'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { tokenService, ServiceToken } from '@/services/tokenService';

export default function TokensManagement() {
  const { user } = useAuth();
  const token = user!.token;

  const [tokens, setTokens] = useState<ServiceToken[]>([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTokens = () => {
    setLoading(true);
    tokenService
      .getAll(token)
      .then(setTokens)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTokens();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    try {
      await tokenService.generate(token, description);
      setDescription('');
      loadTokens();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRevoke = async (id: number) => {
    try {
      await tokenService.revoke(token, id);
      loadTokens();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Jetons d'authentification</h2>
        <p className="text-sm text-gray-500">
          Gérez les jetons utilisés par les services web restreints (SOAP CRUD utilisateurs).
        </p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleGenerate} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex gap-3">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du jeton (ex : accès client Java)"
          className="flex-1 border border-gray-300 rounded-lg p-2"
        />
        <button type="submit" className="cursor-pointer bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Générer un jeton
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="py-4 px-6">Jeton</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Statut</th>
              <th className="py-4 px-6">Créé le</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">Chargement...</td></tr>
            ) : tokens.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">Aucun jeton généré.</td></tr>
            ) : (
              tokens.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-6 font-mono text-xs text-gray-700 max-w-xs truncate">{t.token}</td>
                  <td className="py-4 px-6 text-gray-600">{t.description}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {t.active ? 'Actif' : 'Révoqué'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{new Date(t.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="py-4 px-6 text-right">
                    {t.active && (
                      <button onClick={() => handleRevoke(t.id)} className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700">
                        Révoquer
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
