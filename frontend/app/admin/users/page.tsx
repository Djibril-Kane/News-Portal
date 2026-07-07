'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService, User } from '@/services/userService';
import { Role } from '@/services/authService';

const ROLES: Role[] = ['EDITEURS', 'ADMINS'];

export default function UsersManagement() {
  const { user } = useAuth();
  const token = user!.token;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('EDITEURS');

  const loadUsers = () => {
    setLoading(true);
    userService
      .getAllUsers(token)
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNom('');
    setPrenom('');
    setEmail('');
    setPassword('');
    setRole('EDITEURS');
    setShowForm(false);
  };

  const handleNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (u: User) => {
    setEditingId(u.id);
    setNom(u.nom);
    setPrenom(u.prenom);
    setEmail(u.email);
    setRole(u.role);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.delete(token, id);
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !prenom || !email || (!editingId && !password)) return;

    try {
      if (editingId) {
        await userService.update(token, editingId, { nom, prenom, email, role });
      } else {
        await userService.create(token, { nom, prenom, email, password, role });
      }
      resetForm();
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-sm text-gray-500 p-8">Chargement des utilisateurs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Utilisateurs & Droits</h2>
          <p className="text-sm text-gray-500">Données réelles synchronisées avec le backend Java.</p>
        </div>
        <button onClick={handleNew} className="cursor-pointer bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Nouvel Utilisateur
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">{editingId ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" className="border border-gray-300 rounded-lg p-2" />
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom" className="border border-gray-300 rounded-lg p-2" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="border border-gray-300 rounded-lg p-2" />
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="border border-gray-300 rounded-lg p-2">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {!editingId && (
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" type="password" className="border border-gray-300 rounded-lg p-2 col-span-2" />
            )}
          </div>
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
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-6 font-medium text-gray-900">{u.prenom} {u.nom}</td>
                  <td className="py-4 px-6 text-gray-500">{u.email}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button onClick={() => handleEdit(u)} className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-950">Modifier</button>
                    <button onClick={() => handleDelete(u.id)} className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700">Supprimer</button>
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
