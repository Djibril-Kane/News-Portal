import { Role } from './authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
}

export interface UserInput {
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: Role;
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const userService = {
  getAllUsers: async (token: string): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: authHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs depuis le backend Java');
    }

    return response.json();
  },

  create: async (token: string, input: UserInput): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Impossible de créer l'utilisateur");
    return response.json();
  },

  update: async (token: string, id: number, input: Omit<UserInput, 'password'>): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Impossible de modifier l'utilisateur");
    return response.json();
  },

  delete: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!response.ok) throw new Error("Impossible de supprimer l'utilisateur");
  },
};
