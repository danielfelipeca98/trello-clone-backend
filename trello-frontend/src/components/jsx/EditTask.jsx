import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header.jsx";

function EditTask() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const taskId = searchParams.get('taskId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  
  // UN SOLO ESTADO PARA TODOS LOS CAMPOS
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    assignedTo: ''
  });

  // CARGAR DATOS DE LA TAREA
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
        setFormData({
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

  // CARGAR USUARIOS
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

  // ACTUALIZAR CAMPO
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // GUARDAR CAMBIOS
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      const token = localStorage.getItem('token');
       const dueDateISO = formData.dueDate ? new Date(formData.dueDate).toISOString() : null;
      const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          dueDate: dueDateISO,
          assignedTo: formData.assignedTo || null
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

  if (loading) return (
    <>
      <Header listId="" />
      <div className="app"><h1>Cargando...</h1></div>
    </>
  );

  if (error) return (
    <>
      <Header listId="" />
      <div className="app">
        <h1>Error: {error}</h1>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    </>
  );

  return (
    <>
      <Header listId="" />
      <div className="app">
        <h1>Editar Tarea</h1>
        <form onSubmit={handleSubmit} className="edit-task-form">
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de entrega</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
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
              value={formData.assignedTo}
              onChange={handleChange}
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
      </div>
    </>
  );
}

export default EditTask;