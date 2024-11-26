// utils/api.ts

// Define la interfaz Task con los campos que esperas recibir de la API
export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string; // Puede ser una cadena o una fecha, según lo que reciba tu API
  isCompleted: boolean;
}

// Función para obtener las tareas
export const getTasks = async (): Promise<Task[]> => {
  try {
    
    const response = await fetch('http://localhost:8080/api/Task', {
      method: 'GET',
      headers: {
        'Accept': 'application/json', // Asegurarse de que estamos pidiendo respuestas en formato JSON
      },
    });
    console.log('Respuesta del servidor:', response);

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
  
};
export const createTask = async (newTask: Task): Promise<Task> => {
  try {
    console.log('Enviando solicitud para crear tarea:', newTask);

    // Realizamos la solicitud POST al backend
    const response = await fetch('http://localhost:8080/api/Task', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    // Si la respuesta no es exitosa, obtenemos más detalles del error
    if (!response.ok) {
      const errorResponse = await response.text(); // Capturamos el cuerpo de la respuesta de error
      console.error('Error del servidor:', errorResponse);
      throw new Error(`Failed to create task: ${errorResponse}`);
    }

    // Parseamos la respuesta JSON que contiene la tarea creada
    const createdTask: Task = await response.json();
    console.log('Tarea creada con éxito:', createdTask);

    return createdTask;
  } catch (error) {
    // Manejamos el error y mostramos el mensaje detallado
    console.error('Error creando tarea:', error);
    throw error;
  }
};
// utils/api.ts
export const deleteTask = async (taskId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/api/Task/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('No se pudo eliminar la tarea');
    }
    return response;
  } catch (err) {
    console.error('Error eliminando tarea:', err);
    throw err;
  }
};

export const editTask = async (task: Task): Promise<Task> => {
  try {
    const response = await fetch(`http://localhost:8080/api/Task/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('No se pudo actualizar la tarea');
    }

    const updatedTask: Task = await response.json();
    return updatedTask;
  } catch (err) {
    console.error('Error actualizando tarea:', err);
    throw err;
  }
};
