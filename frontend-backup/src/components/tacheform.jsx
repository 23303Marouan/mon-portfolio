import { useState } from 'react';

export default function Tacheform({ addTache }) {
  const [newTache, setNewTache] = useState("");

  const handleSubmit = (event) => {
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