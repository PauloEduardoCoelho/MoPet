const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create-camp-admin', verifyToken, verifyRole('superAdmin'), async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, role: 'campAdmin' });
        res.status(201).json({ message: 'Administrador de campanha criado com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
