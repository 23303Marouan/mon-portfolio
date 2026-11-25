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
