'use client';

import React, { useEffect, useState } from 'react';
import { userService, User } from '@/services/userService';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const mockToken = "TON_JWT_TOKEN_ICI"; 
        
        const data = await userService.getAllUsers(mockToken);
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Impossible de charger les utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-sm text-gray-500 p-8">Chargement des utilisateurs...</div>;
  if (error) return <div className="text-sm text-red-600 p-8">Erreur : {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Utilisateurs & Droits</h2>
        <p className="text-sm text-gray-500">Données réelles synchronisées avec le backend Java.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="py-4 px-6">Nom</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Rôle</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">Aucun utilisateur trouvé.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                  {/* Sécurité : affiche username si name est indéfini */}
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {user.name || user.username || 'Sans nom'}
                  </td>
                  <td className="py-4 px-6 text-gray-500">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-950">Modifier</button>
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