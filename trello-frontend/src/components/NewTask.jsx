import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import Header from "./Header";
import './css/NewTask.css';

function NewTask() {
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(window.location.search);
    const listId = searchParams.get('listId') || '6a56a66b839585c7f69873a5'
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('Pending');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [assignedTo, setAssignedTo] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/auth/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users || []);
                }
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        };
        fetchUsers();
    }, []);



    const handleCreateTask = (e) => {
        e.preventDefault();

        if (!title.trim() || !listId) {
            alert('Escribe una tarea y asegúrate de tener un listId');
            return;
        }

        const task = {
            title: title,
            description: description,
            status: status,
            dueDate: dueDate || null,
            assignedTo: assignedTo || null,
            listId: listId,
        };
        socket.emit('new-task', task);
        setLoading(true);
        navigate('/');
    };
    return (
        <>
            <Header listId={listId} />
            <div className="create-task">
                <h1>Nueva tarea</h1>
                <form onSubmit={handleCreateTask}>
                    <input
                        type="text"
                        placeholder="Nueva tarea..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                    />
                    <textarea
                        placeholder="Descripcion(Opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows='3'
                    ></textarea>
                    <div className="row">
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>

                        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                            <option value="">Sin asignar</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Tarea'}
                    </button>

                </form>

            </div>

        </>
    )
}
export default NewTask;