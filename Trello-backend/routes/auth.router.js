import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Valores faltantes' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ error: 'Email duplicado' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ 
        email, 
        password: hashedPassword, 
        name 
    });
    
    await user.save();

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name
    };

    const tkn = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', tkn, { httpOnly: true, secure: false, maxAge: 3600000, sameSite: 'lax' });
    res.status(201).json({
        message: 'Usuario creado exitosamente',
        email: user.email,
        name: user.name,
        ID: user.id
    });
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Valores faltantes' });
    }
    
    const reseach = await User.findOne({ email });
    if (!reseach) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    const isMatch = await reseach.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const payload = {
        id: reseach.id,
        email: reseach.email,
        name: reseach.name
    };

    const tkn = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', tkn, { httpOnly: true, secure: false, maxAge: 3600000, sameSite: 'lax' });
    res.status(200).json({
        message: 'Login exitoso',
        email: reseach.email,
        name: reseach.name,
        ID: reseach.id,
        token: tkn
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Sesion cerrada' });
});

router.get('/profile', auth, (req, res) => {
    res.status(200).json({ user: req.user });
});

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({}, 'name email _id');
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;