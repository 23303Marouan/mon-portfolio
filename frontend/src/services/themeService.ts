import { API_URL } from "./config";
import type { Theme } from "../types";

// Récupérer tous les thèmes
export async function getThemes(): Promise<Theme[]> {
  const response = await fetch(`${API_URL}/themes`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des thèmes");
  }

  return response.json();
}

// Ajouter un thème
export async function addTheme(title: string): Promise<Theme> {
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
export async function deleteTheme(id: number): Promise<unknown> {
  const response = await fetch(`${API_URL}/themes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du thème");
  }

  return response.json();
}
