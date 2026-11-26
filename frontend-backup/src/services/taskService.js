
import { API_URL } from "./config";

// Récupérer toutes les tâches
export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des tâches");
  }

  return response.json();
}

// Ajouter une tâche
export async function addTask(title, themeId) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, themeId }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout de la tâche");
  }

  return response.json();
}

// Modifier une tâche
export async function updateTask(id, title, themeId) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, themeId }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la modification de la tâche");
  }

  return response.json();
}

// Supprimer une tâche
export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la tâche");
  }

  return response.json();
}
