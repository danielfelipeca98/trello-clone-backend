import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import connectDB from './config/database.js'
import authRouter from './routes/auth.router.js'
import taskRouter  from './routes/task.router.js'
import boardRouter from './routes/board.router.js'; 
import listRouter from './routes/list.router.js';  
import Task from './models/task.model.js'; 


dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
   origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.static('public'));


app.use('/api/auth', authRouter);
app.use('/api/boards', boardRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/lists', listRouter);

const io = new SocketServer(server, {
   cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
   }
});

io.on('connection', (socket) => {
   console.log('Cliente conectado');

    socket.on('new-task', async(taskData) => {
      try{
         const task = new Task ({
            title: taskData.title,
            description: taskData.description || '',
            status: taskData.status || 'pending',
            dueDate: taskData.dueDate || null,
            assignedTo: taskData.assignedTo || null, 
            list: taskData.listId,
            position:0

         });
         await task.save();
      
        console.log(' Nueva tarea guardad en mongoDb:', task);
        io.emit('task-created', task);
         } catch (error) {
            console.error('Error al guardar tarea:', error);
            socket.emit('error', { message: 'Error al crear tarea' });
            return;
        }
    });
    socket.on('update-task', (taskData) => {
        console.log('Tarea actualizada:', taskData);
        io.emit('task-updated', taskData);
    });
    socket.on('delete-task', async(taskId) => {
      try{
         
         await Task.findByIdAndDelete(taskId);
         console.log(' Tarea eliminada de mongoDb:', taskId);
        io.emit('task-deleted', taskId);
      }catch (error) {
            console.error('Error al eliminar tarea:', error);
            socket.emit('error', { message: 'Error al eliminar tarea' });
        }  
    });


      socket.on('disconnect', () => {
        console.log(' Cliente desconectado');
      });
   
      
});


connectDB();

server.listen(PORT, () => {
   console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

