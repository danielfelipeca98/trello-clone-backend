import express from 'express';
import auth from '../middleware/auth.middleware.js';
import Comment from '../models/comment.model.js';
import Task from '../models/task.model.js';
import Board from '../models/board.model.js';
import List from '../models/list.model.js';

const router = express.Router();

// GET /api/comments/task/:taskId - Obtener comentarios de una tarea
router.get('/task/:taskId', auth, async (req, res) => {
    try {
        const { taskId } = req.params;

        // Verificar que la tarea existe y el usuario tiene acceso
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        const list = await List.findById(task.list);
        if (!list) {
            return res.status(404).json({ error: 'Lista no encontrada' });
        }

        const board = await Board.findById(list.board);
        if (!board) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        const isOwner = board.owner.toString() === req.user.id;
        const isMember = board.members.some(m => m.toString() === req.user.id);

        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'No tienes acceso a esta tarea' });
        }

        const comments = await Comment.find({ task: taskId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ comments });
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/comments - Crear un comentario
router.post('/', auth, async (req, res) => {
    try {
        const { content, taskId } = req.body;

        if (!content || !taskId) {
            return res.status(400).json({ error: 'Contenido y ID de tarea son obligatorios' });
        }

        // Verificar acceso a la tarea
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        const list = await List.findById(task.list);
        if (!list) {
            return res.status(404).json({ error: 'Lista no encontrada' });
        }

        const board = await Board.findById(list.board);
        if (!board) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        const isOwner = board.owner.toString() === req.user.id;
        const isMember = board.members.some(m => m.toString() === req.user.id);

        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'No tienes acceso a esta tarea' });
        }

        const comment = new Comment({
            content,
            task: taskId,
            author: req.user.id
        });

        await comment.save();
        await comment.populate('author', 'name email');

        res.status(201).json({ comment });
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;