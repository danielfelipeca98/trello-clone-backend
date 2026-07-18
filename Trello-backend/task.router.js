import express from 'express';
import auth from '../middleware/auth.middleware.js';
import Task from '../models/task.model.js';
import Board from '../models/board.model.js';
import List from '../models/list.model.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const listId = req.body.list;

        if (!title || !listId) {
            return res.status(401).json({ error: 'Datos incompletos:' });
        }
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'Lista no encontrada' });
        }
        const board = await Board.findById(list.board);
        if (!board) {
            return res.status(404).json({ error: 'Tablero no encontrado' })
        }
        const isOwner = board.owner.toString() === req.user.id;
        const isMember = board.members.some(member => member.toString() === req.user.id);
        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'No tienes acceso a este tablero' });
        }
        const task = new Task({
            title: title,
            description: description || '',
            list: listId,
            position: 0,
            status: 'pending'
        });
        await task.save();
        res.status(201).json({
            message: 'Tarea creada exitosamente',
            task
        });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

})

router.get('/list/:listId', auth, async (req, res) => {
    console.log('Ruta /list/:listId ejecutada con ID:', req.params.listId);
    try {
        const listId = req.params.listId;
        const list = await List.findById(listId);
        const boardId = list.board; 
        if (!list) {
            console.log('Lista no encontrada');
            return res.status(404).json({ error: 'Lista no encontrado' })
        }
        const board = await Board.findById(list.board);
        if (!board) {
            console.log('Tablero no encontrado');
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }
        const isOwner = board.owner.toString() === req.user.id;
        const isMember = board.members.some(member => member.toString() === req.user.id)
        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'No tienes acceso a este tablero' });
        }
        const tasks = await Task.find({ list: listId })
        const orden = tasks.sort((a, b) => a.position - b.position);
        res.status(200).json({
            message: 'Tareas obtenidas exitosamente',
            tasks: orden,
            boardId: boardId
        })
    } catch (error) {
        console.error('Error al obtener listas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });

    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const taskId = req.params.id;
        console.log('🔍 Buscando tarea con ID:', taskId);
        const task = await Task.findById(taskId);
        if (!task) {
            console.log('Tarea no encontrada');
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        console.log('Tarea encontrada:', task.toObject());
        res.status(200).json(task.toObject());
    } catch (error) {
        console.error('Error al obtener tarea:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de tarea inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const taskId = req.params.id;
        const title = req.body.title;
        const description = req.body.description;
        const listId = req.body.list;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' })
        }
        const list = await List.findById(task.list);
        const board = await Board.findById(list.board);

        const isOwner = board.owner.toString() === req.user.id;
        const isMember = board.members.some(member => member._id.toString() === req.user.id);

        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'No tienes acceso a esta lista' });
        }
        if (title) task.title = title;
        if (description) task.description = description;
        if (listId) task.list = listId;
        if (req.body.position !== undefined) task.position = req.body.position;
        if (req.body.status) task.status = req.body.status;
        if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo;
        if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;

        await task.save();
        res.status(200).json({
            message: 'Tarea actalizada exitosamente',
            task
        });
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de lista inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' })
        }
        const list = await List.findById(task.list);
        const board = await Board.findById(list.board);
        const isOwner = board.owner.toString() === req.user.id;
        const isMember = board.members.some(member => member._id.toString() === req.user.id);

        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'No tienes acceso a esta lista' });
        }
        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de lista inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

export default router;
