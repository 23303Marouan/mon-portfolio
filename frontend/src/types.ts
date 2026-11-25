export type Theme = {
  id: number;
  title: string;
};

export type Task = {
  id: number;
  title: string;
  themeId: number | null;
};

// Une tâche avec le titre de son thème (utilisé dans l'affichage)
export type TaskWithTheme = Task & {
  theme: string;
};

// Tâche simple de la page "Taches" (stockée dans localStorage)
export type Tache = {
  id: number;
  name: string;
};
