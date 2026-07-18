import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewTask from './NewTask';
import '../../App.css'
function Header({ listId }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const nombre = user?.name || 'Usuario';

    const HandleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    return (
        <header>
            <nav>
                <div className="logo">
                    <span>Trello Clone</span>
                </div>
                <a href="/">Mi lista</a>
                <a href={`/new-task?listId=${listId}`}>Nueva Tarea</a>
                <a href="/calendario"> Calendario</a> 
                <div className="user-info">
                    <span>{nombre}</span>
                    <button onClick={HandleLogout}>Cerrar sesión</button>
                </div>
            </nav>
        </header>
    )

};
export default Header;

