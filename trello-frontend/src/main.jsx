import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Login from './components/jsx/Login.jsx'
import Register from './components/jsx/Register.jsx'
import NewTask from './components/jsx/NewTask.jsx';
import EditTask from './components/jsx/EditTask.jsx';
import Calendario from './components/jsx/Calendario.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path='/new-task' element={<NewTask/>} />
        <Route path='/edit-task' element= {<EditTask/>}/>
        <Route path="/calendario" element={<Calendario />} />
        
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
