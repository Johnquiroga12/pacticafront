import React, { useState, useEffect } from 'react';
import { Task, createTask, editTask } from '../utils/api'; // Importamos las funciones
import './TaskForm.css'; // Importamos el archivo CSS

interface TaskFormProps {
  taskToEdit: Task | null;
  onTaskCreated: (newTask: Task) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  taskToEdit,
  onTaskCreated,
  onTaskUpdated,
}) => {
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: '',
    description: '',
    dueDate: '',
    isCompleted: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setNewTask({
        id: taskToEdit.id,
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: new Date(taskToEdit.dueDate).toISOString().substring(0, 10), // Convertir fecha
        isCompleted: taskToEdit.isCompleted,
      });
    }
  }, [taskToEdit]); // Este efecto se ejecuta cuando taskToEdit cambia

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    // Validación de campos obligatorios
    if (!newTask.title) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!newTask.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es obligatoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const dueDate = new Date(newTask.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Establecer la hora a medianoche (00:00:00)
      const formattedDueDate = dueDate.toISOString();  // Convertir a formato UTC (ISO 8601)

      if (taskToEdit) {
        // Si estamos editando, llamamos a la función editTask
        const updatedTask = await editTask({
          ...newTask,
          dueDate: formattedDueDate,
        });
        onTaskUpdated(updatedTask); // Llamamos al callback con la tarea actualizada
      } else {
        // Si es una nueva tarea, llamamos a la función createTask
        const createdTask = await createTask({
          ...newTask,
          dueDate: formattedDueDate,
        });
        onTaskCreated(createdTask); // Llamamos al callback con la tarea creada
      }

      // Limpiar el formulario después de guardar
      setNewTask({
        id: 0,
        title: '',
        description: '',
        dueDate: '',
        isCompleted: false,
      });

      setErrors({});
    } catch (err) {
      console.error('Error al guardar tarea:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Título:</label>
        <input
          type="text"
          id="title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>

      <div>
        <label htmlFor="description">Descripción:</label>
        <textarea
          id="description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="dueDate">Fecha de vencimiento:</label>
        <input
          type="date"
          id="dueDate"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          required
        />
        {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
      </div>

      <div>
        <label htmlFor="isCompleted">Completada:</label>
        <input
          type="checkbox"
          id="isCompleted"
          checked={newTask.isCompleted}
          onChange={(e) => setNewTask({ ...newTask, isCompleted: e.target.checked })}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
      </button>
    </form>
  );
};

export default TaskForm;
