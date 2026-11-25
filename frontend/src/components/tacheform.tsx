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
