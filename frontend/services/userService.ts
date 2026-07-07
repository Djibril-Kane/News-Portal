const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: number;
  username?: string; // Prévoyance au cas où le champ s'appelle username au lieu de name
  name?: string;
  email: string;
  role: string;
}

export const userService = {
  // Consomme directement l'endpoint @GetMapping de ton UserController.java
  getAllUsers: async (token: string): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Requis par ton @PreAuthorize("hasRole('ADMINS')")
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs depuis le backend Java');
    }

    return response.json();
  }
};