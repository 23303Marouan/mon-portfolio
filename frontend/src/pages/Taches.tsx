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
