import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Vue d'ensemble</h2>
        <p className="text-sm text-gray-500">Bienvenue sur votre espace d'administration.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-sm font-medium text-gray-400">Articles Total</span>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">142</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-sm font-medium text-gray-400">Utilisateurs Actifs</span>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">1,240</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-sm font-medium text-gray-400">Signalements</span>
          <h3 className="text-3xl font-bold mt-1 text-red-600">3</h3>
        </div>
      </div>
    </div>
  );
}