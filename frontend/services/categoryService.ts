const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Category {
  id: number;
  nom: string;
  description: string;
}

export interface CategoryInput {
  nom: string;
  description: string;
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Impossible de charger les catégories');
    return response.json();
  },

  create: async (token: string, input: CategoryInput): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Impossible de créer la catégorie');
    return response.json();
  },

  update: async (token: string, id: number, input: CategoryInput): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Impossible de modifier la catégorie');
    return response.json();
  },

  delete: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!response.ok) throw new Error('Impossible de supprimer la catégorie');
  },
};
