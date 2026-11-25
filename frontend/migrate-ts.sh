#!/usr/bin/env bash
# Migration JS -> TypeScript. À lancer depuis le dossier "frontend" :  bash migrate-ts.sh
set -e

if [ ! -d src ] || [ ! -f package.json ]; then
  echo "Lance ce script depuis le dossier frontend (celui qui contient src/ et package.json)."
  exit 1
fi

echo "1/5 Installation de TypeScript..."
npm install -D typescript @types/react @types/react-dom

echo "2/5 Renommage des fichiers..."
ren() { [ -f "$1" ] && mv "$1" "$2" || true; }
ren src/main.jsx src/main.tsx
ren src/App.jsx src/App.tsx
ren src/context/AuthContext.jsx src/context/AuthContext.tsx
for f in tache tacheform taskForm taskList themeList logInForm; do
  ren "src/components/$f.jsx" "src/components/$f.tsx"
done
rm -f src/components/logIn.jsx   # doublon inutilisé de logInForm
for f in Blog Home LogIn Settings Taches; do
  ren "src/pages/$f.jsx" "src/pages/$f.tsx"
done
for f in config taskService themeService; do
  ren "src/services/$f.js" "src/services/$f.ts"
done
[ -f index.html ] && sed -i.bak 's#/src/main.jsx#/src/main.tsx#' index.html && rm -f index.html.bak

echo "3/5 Configuration TypeScript..."
if [ ! -f tsconfig.json ]; then
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
EOF
fi

echo "4/5 Écriture des fichiers typés..."

cat > src/types.ts <<'EOF'
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
EOF

cat > src/main.tsx <<'EOF'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
EOF

cat > src/context/AuthContext.tsx <<'EOF'
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type AuthContextType = {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(
    () => localStorage.getItem("isAdmin") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isAdmin", String(isAdmin));
  }, [isAdmin]);

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
EOF

cat > src/components/tache.tsx <<'EOF'
type TacheProps = {
  name: string;
  id: number;
  deleteTache: (id: number) => void;
  isAdmin: boolean;
};

export default function Tache({ name, id, deleteTache, isAdmin }: TacheProps) {
  return (
    <li>
      {name}
      {isAdmin && <button onClick={() => deleteTache(id)}>X</button>}
    </li>
  );
}
EOF

cat > src/components/tacheform.tsx <<'EOF'
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Tache } from '../types';

type TacheformProps = {
  addTache: (tache: Tache) => void;
};

export default function Tacheform({ addTache }: TacheformProps) {
  const [newTache, setNewTache] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTache.trim() === "") return;

    addTache({ id: new Date().getTime(), name: newTache.trim() });
    setNewTache("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={newTache}
        onChange={(e) => setNewTache(e.target.value)}
        type="text"
        placeholder="Ajoutez une tache..."
      />

      <button type="submit">Ajouter +</button>
    </form>
  );
}
EOF

cat > src/components/taskForm.tsx <<'EOF'
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { TaskWithTheme } from '../types';

type TaskFormProps = {
  onAdd: (data: { text: string; theme: string }) => void;
  taskToEdit: TaskWithTheme | null;
};

function TaskForm({ onAdd, taskToEdit }: TaskFormProps) {
  const [text, setText] = useState<string>("");
  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    if (taskToEdit) {
      setText(taskToEdit.title);
      setTheme(taskToEdit.theme);
    }
  }, [taskToEdit]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (text.trim() === "") return;

    onAdd({ text, theme });

    setText("");
    setTheme("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Thème..."
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      />

      <textarea
        placeholder="Ajouter une tâche..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={1}
        onInput={(e) => {
          const target = e.currentTarget;
          target.style.height = "auto";
          target.style.height = target.scrollHeight + "px";
        }}
      />

      <button className="save" type="submit">
        {taskToEdit ? "Enregistrer les modifications" : "Ajouter"}
      </button>
    </form>
  );
}

export default TaskForm;
EOF

cat > src/components/taskList.tsx <<'EOF'
import type { TaskWithTheme } from '../types';

type TaskListProps = {
  tasks: TaskWithTheme[];
  onDelete: (id: number) => void;
  onModif: (task: TaskWithTheme) => void;
  isAdmin: boolean;
};

function TaskList({ tasks, onDelete, onModif, isAdmin }: TaskListProps) {
  return (
    <div>
      {tasks.map((task) => (
        <p key={task.id}>
          {task.theme} - {task.title}

          {isAdmin && (
            <>
              <button className="deletTheme" onClick={() => onDelete(task.id)}>
                Supprimer
              </button>

              <button className="modifier" onClick={() => onModif(task)}>
                Modifier
              </button>
            </>
          )}
        </p>
      ))}
    </div>
  );
}

export default TaskList;
EOF

cat > src/components/themeList.tsx <<'EOF'
import { useState } from 'react';
import type { Theme } from '../types';

type ThemeListProps = {
  themes: Theme[];
  onDelete: (id: number) => void;
};

function ThemeList({ themes, onDelete }: ThemeListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className="viewThemes" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Masquer les thèmes" : "Afficher les thèmes"}
      </button>

      <br />
      <br />

      {isOpen && (
        <div>
          {themes.map((theme) => (
            <p key={theme.id}>
              {theme.title}

              <button className="deletTheme" onClick={() => onDelete(theme.id)}>
                Supprimer
              </button>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeList;
EOF

cat > src/components/logInForm.tsx <<'EOF'
import { useState } from 'react';
import type { FormEvent } from 'react';

type LogInFormProps = {
  onLogin: (id: string, pwd: string) => void;
};

export default function LogInForm({ onLogin }: LogInFormProps) {
  const [id, setId] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(id, pwd);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Identifiant"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <button className="login" type="submit">Se connecter</button>
    </form>
  );
}
EOF

cat > src/pages/LogIn.tsx <<'EOF'
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LogInForm from '../components/logInForm';

const ID = '23303@ecam.be';
const PWD = 'Marouan';

export default function LogIn() {
  const { isAdmin, setIsAdmin } = useAuth();
  const [error, setError] = useState<string>("");

  const handleLogin = (id: string, pwd: string) => {
    if (id === ID && pwd === PWD) {
      setIsAdmin(true);
      setError("");
    } else {
      setError("Identifiant ou mot de passe incorrect");
    }
  };

  return (
    <main className="container">
      <h1>Connexion</h1>

      {isAdmin ? (
        <>
          <p>Vous êtes connecté.</p>
          <button onClick={() => setIsAdmin(false)}>Se déconnecter</button>
        </>
      ) : (
        <>
          <LogInForm onLogin={handleLogin} />
          {error && <p>{error}</p>}
        </>
      )}
    </main>
  );
}
EOF

cat > src/pages/Taches.tsx <<'EOF'
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Tache as TacheType } from '../types';

import Tache from '../components/tache';
import Tacheform from '../components/tacheform';

export default function Taches() {
  const { isAdmin } = useAuth();

  const [taches, setTaches] = useState<TacheType[]>(() => {
    const saved = localStorage.getItem("taches");
    return saved ? (JSON.parse(saved) as TacheType[]) : [];
  });

  // À chaque changement de "taches", on sauvegarde
  useEffect(() => {
    localStorage.setItem("taches", JSON.stringify(taches));
  }, [taches]);

  const deleteTodo = (id: number) => {
    setTaches(taches.filter((tache) => tache.id !== id));
  };

  const addTodo = (newTacheObject: TacheType) => {
    setTaches([...taches, newTacheObject]);
  };

  return (
    <main className="container">
      <h1>Liste des taches</h1>

      <ul>
        {taches.map((todo) => (
          <Tache
            key={todo.id}
            name={todo.name}
            id={todo.id}
            deleteTache={deleteTodo}
            isAdmin={isAdmin}
          />
        ))}
      </ul>

      {isAdmin && <Tacheform addTache={addTodo} />}
    </main>
  );
}
EOF

cat > src/pages/Blog.tsx <<'EOF'
import { useState, useEffect } from 'react';

import TaskForm from '../components/taskForm';
import TaskList from '../components/taskList';
import ThemeList from '../components/themeList';
import { useAuth } from '../context/AuthContext';
import type { Theme, TaskWithTheme } from '../types';

import {
  addTask,
  deleteTask,
  updateTask,
  getTasks
} from '../services/taskService';

import {
  addTheme,
  deleteTheme,
  getThemes
} from '../services/themeService';

function Blog() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState<TaskWithTheme[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<TaskWithTheme | null>(null);

  // Charger les thèmes et les tâches depuis PostgreSQL
  useEffect(() => {
    async function loadData() {
      try {
        const [themesData, tasksData] = await Promise.all([
          getThemes(),
          getTasks()
        ]);

        setThemes(themesData);

        const formattedTasks: TaskWithTheme[] = tasksData.map(task => ({
          ...task,
          theme: themesData.find(t => t.id === task.themeId)?.title || ""
        }));

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    }

    loadData();
  }, []);

  // Ajouter ou modifier une tâche
  async function handleAdd({ text, theme }: { text: string; theme: string }) {
    try {
      const themeTitle = theme.trim();

      let themeData = themes.find(
        t => t.title.toLowerCase() === themeTitle.toLowerCase()
      );

      // Créer le thème s'il n'existe pas
      if (themeTitle && !themeData) {
        themeData = await addTheme(themeTitle);
        const created = themeData;
        setThemes(current => [...current, created]);
      }

      const themeId = themeData?.id ?? null;

      if (taskToEdit) {
        const updatedTask = await updateTask(
          taskToEdit.id,
          text,
          themeId
        );

        setTasks(current =>
          current.map(task =>
            task.id === taskToEdit.id
              ? { ...updatedTask, theme: themeTitle }
              : task
          )
        );

        setTaskToEdit(null);
      } else {
        const newTask = await addTask(text, themeId);

        setTasks(current => [
          ...current,
          { ...newTask, theme: themeTitle }
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  }

  // Supprimer une tâche
  async function handleDelete(id: number) {
    try {
      await deleteTask(id);
      setTasks(current => current.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erreur suppression tâche :", error);
    }
  }

  // Supprimer un thème
  async function handleDeleteTheme(id: number) {
    try {
      await deleteTheme(id);
      setThemes(current => current.filter(theme => theme.id !== id));

      setTasks(current =>
        current.map(task =>
          task.themeId === id
            ? { ...task, theme: "", themeId: null }
            : task
        )
      );
    } catch (error) {
      console.error("Erreur suppression thème :", error);
    }
  }

  // Modifier une tâche
  function handleModif(task: TaskWithTheme) {
    setTaskToEdit(task);
  }

  // Supprimer toutes les tâches
  async function handleDeleteAll() {
    if (!window.confirm("Supprimer toutes les tâches ?")) return;
    try {
      await Promise.all(tasks.map(task => deleteTask(task.id)));
      setTasks([]);
    } catch (error) {
      console.error("Erreur suppression des tâches :", error);
    }
  }

  // Supprimer tous les thèmes
  async function handleDeleteAllThemes() {
    if (!window.confirm("Supprimer tous les thèmes ?")) return;
    try {
      for (const theme of themes) {
        await deleteTheme(theme.id);
      }

      setThemes([]);
      setTasks(current =>
        current.map(task => ({ ...task, theme: "", themeId: null }))
      );
    } catch (error) {
      console.error("Erreur suppression des thèmes :", error);
    }
  }

  return (
    <main className="container">
      <h1>Mon blog</h1>

      {isAdmin && (
        <>
          <ThemeList
            themes={themes}
            onDelete={handleDeleteTheme}
          />

          <TaskForm
            onAdd={handleAdd}
            taskToEdit={taskToEdit}
          />
        </>
      )}

      <TaskList
        tasks={tasks}
        onDelete={handleDelete}
        onModif={handleModif}
        isAdmin={isAdmin}
      />

      {isAdmin && tasks.length > 0 && (
        <button className="deletTheme" onClick={handleDeleteAll}>
          Tout supprimer
        </button>
      )}

      {isAdmin && themes.length > 0 && (
        <button className="deletTheme" onClick={handleDeleteAllThemes}>
          Supprimer tous les thèmes
        </button>
      )}
    </main>
  );
}

export default Blog;
EOF

cat > src/services/config.ts <<'EOF'
// Adresse du backend. En production, définir VITE_API_URL dans frontend/.env.production
export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
EOF

cat > src/services/taskService.ts <<'EOF'
import { API_URL } from "./config";
import type { Task } from "../types";

// Récupérer toutes les tâches
export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des tâches");
  }

  return response.json();
}

// Ajouter une tâche
export async function addTask(title: string, themeId: number | null): Promise<Task> {
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
export async function updateTask(
  id: number,
  title: string,
  themeId: number | null
): Promise<Task> {
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
export async function deleteTask(id: number): Promise<unknown> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la tâche");
  }

  return response.json();
}
EOF

cat > src/services/themeService.ts <<'EOF'
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
EOF

echo "5/5 Vérification des types..."
npx tsc --noEmit && echo "Migration terminée, aucune erreur TypeScript." || echo "Migration terminée, mais tsc signale des erreurs (voir ci-dessus)."

echo "Tu peux lancer le projet avec : npm run dev"