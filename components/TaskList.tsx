// components/TaskList.tsx
import React from 'react';
import { Task } from '../utils/api';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  return (
    <div className="task-list"> {/* Aquí se aplica el contenedor con scroll */}
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>{new Date(task.dueDate).toLocaleDateString()}</p>
          <p>{task.isCompleted ? 'Completada' : 'Pendiente'}</p>
          <button onClick={() => onEditTask(task)}>Editar</button>
          <button onClick={() => onDeleteTask(task.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
