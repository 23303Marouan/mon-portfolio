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
