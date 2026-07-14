import express from 'express';
import auth from '../middleware/auth.middleware.js'
import List from '../models/list.model.js'
import Board from '../models/board.model.js'

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const name = req.body.name;
        const boardId = req.body.boardId

        if (!name || !boardId) {
            return res.status(401).json({ error: 'Datos incompletos:' });
        }

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: 'Tablero no encontrado' })
        }

        const isOwner = board.owner.toString() === req.user.id;
        const isMember = board.members.some(member => member.toString() === req.user.id);
        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'No tienes acceso a este tablero' });
        }
        const list = new List({
            name: name,
            board: boardId,
            position: 0
        });
        await list.save();
        res.status(201).json({
            message: 'Lista creada exitosamente',
            list
        });
    } catch (error) {
        console.error('Error al crear lista:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

router.get('/:boardId', auth, async (req, res) => {
    try {
        const boardId = req.params.boardId;

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: 'Tablero no encontrado' })
        }

        const isOwner = board.owner.toString() === req.user.id;
        const isMember = board.members.some(member => member.toString() === req.user.id)
        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'No tienes acceso a este tablero' });
        }
        const lists = await List.find({ board: boardId })
        const orden = lists.sort((a, b) => a.position - b.position);
        res.status(200).json({
            message: 'Listas obtenidas exitosamente',
            lists: orden
        });
    } catch (error) {
        console.error('Error al obtener listas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const listId = req.params.id;
        const { name, position, boardId } = req.body;

        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'Lista no encontrada' })
        }
        const board = await Board.findById(list.board);
        if (!board) { 
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }
        const isOwner = board.owner.toString() === req.user.id;
        if (!isOwner) {
            return res.status(403).json({ error: 'No tienes acceso a esta lista' });
        }
        if (name) list.name = name;
        if (position !== undefined) list.position = position;
        await list.save();
        res.status(200).json({
            message: 'Lista actualizado exitosamente',
            list
        })

    } catch (error) {
        console.error('Error al actualizar Lista:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de lista inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})
router.delete('/:id', auth, async (req, res) => {
    try {
        const listId = req.params.id;
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'Lista no encontrada' })
        }
        const board = await Board.findById(list.board);
        const isOwner = board.owner.toString() === req.user.id;
        if (!isOwner) {
            return res.status(403).json({ error: 'No tienes acceso a esta lista' });
        }
        await List.findByIdAndDelete(listId)
    } catch (error) {
        console.error('Error al eliminar Lista:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de lista inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})
export default router;