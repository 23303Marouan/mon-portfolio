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
