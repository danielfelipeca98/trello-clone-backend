import express from 'express'
import auth from '../middleware/auth.middleware.js'
import Board from '../models/board.model.js'

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        if (!name) {
            return res.status(400).json({ error: 'El nombre es obligatorio' });
        }
        const board = new Board({
            name,
            description,
            owner: req.user.id,
            members: []
        });
        await board.save();
        res.status(201).json({ message: 'Tablero creado exitosamente', board })
            ;
    } catch (error) {
        console.error('Eror al crear el tablero', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message })
        }
    }

});


router.get('/', auth, async (req, res) => {
    try {
        const boards = await Board.find({
            $or: [
                { owner: req.user.id },
                { members: req.user.id }
            ]
        });
        res.status(200).json({
            message: 'Tableros obtenidos exitosamente', boards
        });
    } catch (error) {
        console.error('Error al obtener tableros', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const boardID = await Board.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('members', 'name email');

        if (!boardID) {
            return res.status(404).json({ message: 'ID no encontrado' })
        }

        const isOwner = boardID.owner._id.toString() === req.user.id;
        const isMember = boardID.members.some(member => member._id.toString() === req.user.id);

        if (!isOwner && !isMember) {
            return res.status(403).json({ error: 'No tienes acceso a este tablero' });
        }

        res.status(200).json({
            message: 'Tablero obtenido exitosamente', boardID
        });
    } catch (error) {
        console.error('Error al obtener tablero:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de tablero inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const boardId = req.params.id;
        const { name, description } = req.body;
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }
        if (board.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permiso para actualizar este tablero' })
        }
        if (name) board.name = name;
        if (description) board.description = description;
        await board.save();
        res.status(200).json({
            message: 'Tablero actualizado exitosamente',
            board
        });
    } catch (error) {
        console.error('Error al actualizar tablero:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de tablero inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const boardId = req.params.id;
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }
        if (board.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este tablero' });
        }
        await Board.findByIdAndDelete(boardId);
        res.status(200).json({ message: 'Tablero eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tablero:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID de tablero inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;