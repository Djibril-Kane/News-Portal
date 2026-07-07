const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ServiceToken {
  id: number;
  token: string;
  description: string;
  active: boolean;
  createdAt: string;
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const tokenService = {
  getAll: async (token: string): Promise<ServiceToken[]> => {
    const response = await fetch(`${API_URL}/users/tokens`, {
      method: 'GET',
      headers: authHeaders(token),
    });
    if (!response.ok) throw new Error('Impossible de charger les jetons');
    return response.json();
  },

  generate: async (token: string, description: string): Promise<ServiceToken> => {
    const response = await fetch(`${API_URL}/users/tokens`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ description }),
    });
    if (!response.ok) throw new Error('Impossible de générer le jeton');
    return response.json();
  },

  revoke: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/users/tokens/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!response.ok) throw new Error('Impossible de révoquer le jeton');
  },
};
