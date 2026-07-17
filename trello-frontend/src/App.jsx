import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import socket from './socket';
import './App.css';
import Header from './components/Header';
import NewTask from './components/NewTask';
import AddMemberForm from './components/jsx/AddMemberForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [listId, setListId] = useState('6a56a66b839585c7f69873a5');
  const [isLoading, setIsLoading] = useState(true);
  const [boardId, setBoardId] = useState('');
  const navigate = useNavigate();

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
          setBoardId(data.boardId || '');
          console.log('Board ID recibido:', data.boardId);
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

  

  const handleDeleteTask = (taskId) => {
    socket.emit('delete-task', taskId);
  };

  if (isLoading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <>
    <Header listId={listId} />
    <div className="app">
      <h1>Lista de Tareas</h1>

      <ul className="task-list"> 
  {tasks.length === 0 ? (
    <li className="empty-message">No hay tareas en esta lista</li>
  ) : (
    tasks.map((task) => (
      <li key={task._id}>
        <div className="task-content">
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          <div className="task-meta">
            <span className={`task-status ${task.status}`}>{task.status}</span>
            <span className="task-date"> Fecha limite {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button onClick={() => handleDeleteTask(task._id)}>Eliminar</button>
        <button onClick={() => navigate(`/edit-task?taskId=${task._id}`)}>Editar</button>
      </li>
    ))
  )}
</ul>
    </div>
    </>
          
  );
}

export default App;