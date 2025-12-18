const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middlewares/auth');

const onlyDigits = (v = '') => String(v).replace(/\D/g, '');

function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
}

router.use(auth, requireSuperAdmin);

router.get('/managers', async (_req, res) => {
  const managers = await User.find({ role: 'manager' })
    .select('_id name email cpf phone role createdAt');
  res.json(managers);
});

router.post('/managers', async (req, res) => {
  try {
    let { name, email, password, cpf, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    email = String(email).trim().toLowerCase();
    cpf = cpf ? onlyDigits(cpf) : undefined;
    phone = phone ? onlyDigits(phone) : undefined;

    if (cpf && cpf.length !== 11) {
      return res.status(400).json({ error: 'CPF deve ter 11 dígitos.' });
    }
    if (phone && !(phone.length === 10 || phone.length === 11)) {
      return res.status(400).json({ error: 'Telefone deve ter 10 ou 11 dígitos.' });
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) return res.status(409).json({ error: 'E-mail já em uso.' });

    if (cpf) {
      const cpfTaken = await User.findOne({ cpf });
      if (cpfTaken) return res.status(409).json({ error: 'CPF já em uso.' });
    }

    const hash = await bcrypt.hash(password, 10);

    const mgr = await User.create({
      name: name.trim(),
      email,
      password: hash,
      cpf,
      phone,
      role: 'manager',
    });

    res.status(201).json({
      _id: mgr._id,
      name: mgr.name,
      email: mgr.email,
      cpf: mgr.cpf,
      phone: mgr.phone,
      role: mgr.role,
      createdAt: mgr.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar gerente.' });
  }
});

router.delete('/managers/:id', async (req, res) => {
  const { id } = req.params;
  const mgr = await User.findById(id);
  if (!mgr) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (mgr.role !== 'manager') {
    return res.status(400).json({ error: 'Somente usuários com papel de gerente podem ser excluídos aqui.' });
  }
  await mgr.deleteOne();
  res.json({ message: 'Gerente removido com sucesso.' });
});

module.exports = router;