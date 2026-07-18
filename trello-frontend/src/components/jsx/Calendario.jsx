import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from "./Header.jsx";
import '../css/Calendario.css';
function Calendario() {
  const [fecha, setFecha] = useState(new Date());
  const [tareas, setTareas] = useState([]);
  const [tareasDelDia, setTareasDelDia] = useState([]);
  const [listId, setListId] = useState('6a56a66b839585c7f69873a5'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/tasks/list/${listId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setTareas(data.tasks || []);
        }
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTareas();
  }, [listId]);

  useEffect(() => {
    if (fecha && tareas.length > 0) {
      const tareasFiltradas = tareas.filter(tarea => {
        if (!tarea.dueDate) return false;
        const fechaTarea = new Date(tarea.dueDate);
        return fechaTarea.toDateString() === fecha.toDateString();
      });
      setTareasDelDia(tareasFiltradas);
    }
  }, [fecha, tareas]);

  const tileContent = ({ date }) => {
    const tieneTarea = tareas.some(tarea => {
      if (!tarea.dueDate) return false;
      const fechaTarea = new Date(tarea.dueDate);
      return fechaTarea.toDateString() === date.toDateString();
    });
    return tieneTarea ? <span className="tarea-marcador">●</span> : null;
  };

  if (loading) {
    return (
      <>
        <Header listId={listId} />
        <div className="calendario-container">
          <h1>Cargando...</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Header listId={listId} />
      <div className="calendario-container">
        <h1>Calendario de Tareas</h1>
        <p className="calendario-subtitulo">
          Los días con ● tienen tareas con fecha límite
        </p>

        <Calendar
          onChange={setFecha}
          value={fecha}
          tileContent={tileContent}
          locale="es-ES"
          className="calendario-custom"
        />

        <div className="tareas-del-dia">
          <h3>
            Tareas para el {fecha.toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </h3>
          {tareasDelDia.length === 0 ? (
            <p className="no-tareas">No hay tareas para este día</p>
          ) : (
            <ul>
              {tareasDelDia.map(tarea => (
                <li key={tarea._id} className="tarea-item">
                  <span className="tarea-titulo">{tarea.title}</span>
                  <span className={`tarea-estado ${tarea.status}`}>{tarea.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Calendario;