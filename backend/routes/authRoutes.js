const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // <- troque de senha para password

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao logar' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email já está em uso' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed, role: role || 'user' });
    await user.save();

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar' });
  }


});

router.delete('/clear', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: 'Todos os usuários foram deletados' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar usuários' });
  }
});


module.exports = router;