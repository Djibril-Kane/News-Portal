const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Role = 'EDITEURS' | 'ADMINS';

export interface AuthResponse {
  token: string;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Email ou mot de passe incorrect');
    }

    return response.json();
  },
};
