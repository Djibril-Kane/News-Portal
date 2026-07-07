const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Article {
  id: number;
  titre: string;
  resume: string;
  contenu: string;
  datePublication: string;
  categoryId: number;
  categoryNom: string;
}

export interface ArticlePage {
  content: Article[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface ArticleInput {
  titre: string;
  resume: string;
  contenu: string;
  categoryId: number;
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// genere le resume a partir du contenu : coupe au dernier espace avant la limite
// pour ne pas tronquer un mot (colonne "resume" limitee a 500 caracteres en base)
export function generateResume(contenu: string, maxLength = 200): string {
  const trimmed = contenu.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= maxLength) return trimmed;

  const cut = trimmed.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}...`;
}

export const articleService = {
  getAll: async (page = 0, size = 5): Promise<ArticlePage> => {
    const response = await fetch(`${API_URL}/articles?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Impossible de charger les articles');
    return response.json();
  },

  getById: async (id: number): Promise<Article> => {
    const response = await fetch(`${API_URL}/articles/${id}`);
    if (!response.ok) throw new Error('Article introuvable');
    return response.json();
  },

  getByCategoryName: async (nom: string): Promise<Article[]> => {
    const response = await fetch(`${API_URL}/rest/articles/categorie/${encodeURIComponent(nom)}`);
    if (!response.ok) throw new Error('Impossible de charger les articles de cette catégorie');
    const data = await response.json();
    return data.articles ?? [];
  },

  create: async (token: string, input: ArticleInput): Promise<Article> => {
    const response = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Impossible de créer l'article");
    return response.json();
  },

  update: async (token: string, id: number, input: ArticleInput): Promise<Article> => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Impossible de modifier l'article");
    return response.json();
  },

  delete: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!response.ok) throw new Error("Impossible de supprimer l'article");
  },
};
