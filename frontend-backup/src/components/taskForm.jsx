
import { useState, useEffect } from 'react';

function TaskForm(props) {
  const [text, setText] = useState("");
  const [theme, setTheme] = useState("");

  useEffect(() => {
    if (props.taskToEdit) {
      setText(props.taskToEdit.title);
      setTheme(props.taskToEdit.theme);
    }
  }, [props.taskToEdit]);

  function handleSubmit(e) {
    e.preventDefault();

    if (text.trim() === "") return;

    props.onAdd({ text, theme });

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
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
        }}
    />

      <button className="save" type="submit">
        {props.taskToEdit ? "Enregistrer les modifications" : "Ajouter"}
      </button>
    </form>
  );
}

export default TaskForm;
