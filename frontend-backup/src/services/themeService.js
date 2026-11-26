
import { API_URL } from "./config";

// Récupérer tous les thèmes
export async function getThemes() {
  const response = await fetch(`${API_URL}/themes`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des thèmes");
  }

  return response.json();
}

// Ajouter un thème
export async function addTheme(title) {
  const response = await fetch(`${API_URL}/themes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout du thème");
  }

  return response.json();
}

// Supprimer un thème
export async function deleteTheme(id) {
  const response = await fetch(`${API_URL}/themes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du thème");
  }

  return response.json();
}
