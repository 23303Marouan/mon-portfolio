
function TaskList({ tasks, onDelete, onModif, isAdmin }) {
  return (
    <div >
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
