import React, { useState, useEffect } from 'react';
import socket from './socket';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [listId, setListId] = useState('6a56a66b839585c7f69873a5');
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkAuthAndFetchTasks = async () => {
      try {
        const authResponse = await fetch('http://localhost:8080/api/auth/profile', {
          credentials: 'include'
        });

        if (!authResponse.ok) {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return;
        }

        if (!listId) {
          console.log('No hay listId, no se cargan tareas');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8080/api/tasks/list/${listId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks || []);
        } else {
          console.error('Error al cargar tareas', response.status);
        }
      } catch (error) {
        console.error('Error de conexión al cargar tareas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchTasks();
  }, [listId]);

  

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
    });

    socket.on('task-created', (task) => {
      console.log('Tarea creada en tiempo real:', task);
      setTasks((prev) => [...prev, task]);
    });

    socket.on('task-deleted', (taskId) => {
      console.log('Tarea eliminada en tiempo real:', taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      socket.off('task-created');
      socket.off('task-deleted');
    };
  }, []);

  const handleCreateTask = () => {
    if (!newTask.trim() || !listId) {
      alert('Escribe una tarea y asegúrate de tener un listId');
      return;
    }

    const task = {
      title: newTask,
      status: 'Pending',
      listId: listId,
    };

    socket.emit('new-task', task);
    setNewTask('');
  };

  const handleDeleteTask = (taskId) => {
    socket.emit('delete-task', taskId);
  };

  if (isLoading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app">
      <h1>Lista de Tareas</h1>

      <div className="create-task">
        <input
          type="text"
          placeholder="Nueva tarea..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
        />
        <button onClick={handleCreateTask}>Crear</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <li className="empty-message">No hay tareas en esta lista</li>
        ) : (
          tasks.map((task) => (
            <li key={task._id}>
              <span>{task.title}</span>
              <button onClick={() => handleDeleteTask(task._id)}>Eliminar</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;