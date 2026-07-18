import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function EditTask() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const taskId = searchParams.get('taskId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // Estados para los campos de la tarea
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    assignedTo: ''
  });

  // Cargar datos de la tarea
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        
        if (!res.ok) throw new Error('Error al cargar');
        
        const data = await res.json();
        setTask({
          title: data.title || '',
          description: data.description || '',
          dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
          status: data.status || 'Pending',
          assignedTo: data.assignedTo || ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    if (taskId) fetchTask();
  }, [taskId]);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/auth/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
      }
    };
    fetchUsers();
  }, []);

  // Cargar comentarios
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/comments/task/${taskId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error('Error al cargar comentarios:', err);
      }
    };
    if (taskId) fetchComments();
  }, [taskId]);

  // Crear comentario
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newComment,
          taskId: taskId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setComments([data.comment, ...comments]);
        setNewComment('');
      } else {
        alert('Error al enviar comentario');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error de conexión');
    }
  };

  // Eliminar comentario
  const handleDeleteComment = async (commentId) => {
    if (!confirm('¿Eliminar este comentario?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      if (res.ok) {
        setComments(comments.filter(c => c._id !== commentId));
      } else {
        alert('Error al eliminar comentario');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error de conexión');
    }
  };

  // Actualizar campo de la tarea
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  // Guardar tarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate || null,
          assignedTo: task.assignedTo || null
        })
      });

      if (res.ok) {
        navigate('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Error al actualizar');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  if (loading) {
    return (
      <>
        <Header listId="" />
        <div className="app"><h1>Cargando...</h1></div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header listId="" />
        <div className="app">
          <h1>Error: {error}</h1>
          <button onClick={() => navigate('/')}>Volver</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header listId="" />
      <div className="app">
        <h1>✏️ Editar Tarea</h1>

        <form onSubmit={handleSubmit} className="edit-task-form">
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleTaskChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleTaskChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de entrega</label>
              <input
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={handleTaskChange}
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                name="status"
                value={task.status}
                onChange={handleTaskChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Asignar a</label>
            <select
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleTaskChange}
            >
              <option value="">Sin asignar</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={() => navigate('/')}>Cancelar</button>
          </div>
        </form>

        <div className="comments-section">
          <h3>Comentarios</h3>
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No hay comentarios aún</p>
            ) : (
              comments.map(comment => {
                const user = JSON.parse(localStorage.getItem('user'));
                const isAuthor = user?.id === comment.author?._id;
                return (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-header">
                      <strong>{comment.author?.name || 'Usuario'}</strong>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="2"
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditTask;