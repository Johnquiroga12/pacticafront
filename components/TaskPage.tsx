// components/TaskPage.tsx
import React, { useEffect, useState } from 'react';
import { getTasks, Task, deleteTask } from '../utils/api'; // Importar deleteTask
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import './TaskPage.css';

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Estado para las tareas filtradas
  const [error, setError] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para el valor del buscador
  const [message, setMessage] = useState<string | null>(null); // Estado para el mensaje

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
        setFilteredTasks(tasksData); // Inicia la lista filtrada con todas las tareas
      } catch (err) {
        setError('Error fetching tasks');
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filtrar las tareas por nombre (título)
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase()) // Filtro insensible a mayúsculas/minúsculas
    );

    setFilteredTasks(filtered); // Actualiza las tareas filtradas
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setMessage('Tarea creada con éxito');
    setTimeout(() => {
      setMessage(null); // Limpiar el mensaje después de 3 segundos
    }, 3000);
    window.location.reload(); // Recargar la página
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setTaskToEdit(null);
    setMessage('Tarea actualizada con éxito');
    setTimeout(() => {
      setMessage(null); // Limpiar el mensaje después de 3 segundos
    }, 3000);
    window.location.reload(); // Recargar la página
  };

  const handleTaskDeleted = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setMessage('Tarea eliminada con éxito');
      setTimeout(() => {
        setMessage(null); // Limpiar el mensaje después de 3 segundos
      }, 3000);
      window.location.reload(); // Recargar la página
    } catch (err) {
      console.error('Error eliminando tarea:', err);
      setError('Error eliminando tarea');
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task); // Asigna la tarea seleccionada a `taskToEdit`
  };

  // Función para filtrar tareas por estado
  const handleFilter = (status: string) => {
    let filtered: Task[] = [];
    if (status === 'all') {
      filtered = tasks; // Mostrar todas las tareas
    } else if (status === 'completed') {
      filtered = tasks.filter((task) => task.isCompleted); // Mostrar solo las tareas completadas
    } else if (status === 'pending') {
      filtered = tasks.filter((task) => !task.isCompleted); // Mostrar solo las tareas pendientes
    }
    setFilteredTasks(filtered);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="task-page-container">
      <div className="task-page-left">
        <div className="task-card">
          <h1>{taskToEdit ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h1>
          <TaskForm
            taskToEdit={taskToEdit}
            onTaskCreated={handleTaskCreated}
            onTaskUpdated={handleTaskUpdated}
          />
        </div>
      </div>

      <div className="task-page-right">
        <div className="task-card">
          <h1>Lista de Tareas</h1>
          {/* Mostrar el número de tareas */}
          <p>Total de tareas: {filteredTasks.length}</p>

          {/* Botones para filtrar tareas */}
          <div className="task-filters">
            <button onClick={() => handleFilter('all')}>Todas</button>
            <button onClick={() => handleFilter('completed')}>Completadas</button>
            <button onClick={() => handleFilter('pending')}>Pendientes</button>
          </div>

          <div className="task-search">
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchQuery}
              onChange={handleSearch} // Función definida aquí
            />
          </div>

          {/* Mostrar mensaje de éxito */}
          {message && (
            <div className="message-success">
              {message}
            </div>
          )}

          <TaskList
            tasks={filteredTasks} // Usamos las tareas filtradas
            onEditTask={handleEditTask} // Pasamos la función handleEditTask
            onDeleteTask={handleTaskDeleted}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
