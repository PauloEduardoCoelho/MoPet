const router = require('express').Router();
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');
const User = require('../models/User');

// Helper para montar resposta sem password
function buildUserPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    cpf: user.cpf || '',
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// GET: meus dados
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(buildUserPayload(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar perfil' });
  }
});

// PUT: atualizar nome, email, phone e CPF (CPF só se ainda não definido)
router.put('/me', auth, async (req, res) => {
  try {
    const { name, email, phone, cpf } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (typeof name === 'string') user.name = name.trim();
    if (typeof email === 'string') user.email = email.trim().toLowerCase();
    if (typeof phone === 'string') user.phone = phone.trim();

    // CPF: só permitir definir se estiver vazio; salvar sem máscara
    if (typeof cpf === 'string') {
      const cleanCpf = cpf.replace(/\D/g, '');
      if (!user.cpf && cleanCpf) {
        // impede duplicidade com outro usuário
        const exists = await User.findOne({ cpf: cleanCpf, _id: { $ne: user._id } }).lean();
        if (exists) return res.status(409).json({ error: 'CPF já está em uso' });
        user.cpf = cleanCpf;
      } else if (user.cpf && cleanCpf && user.cpf !== cleanCpf) {
        return res.status(400).json({ error: 'CPF já definido anteriormente e não pode ser alterado.' });
      }
    }

    await user.save();
    res.json(buildUserPayload(user));
  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({ error: 'Email já está em uso' });
    }
    if (err.code === 11000 && err.keyPattern?.cpf) {
      return res.status(409).json({ error: 'CPF já está em uso' });
    }
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// PUT: alterar email (requer senha atual)
router.put('/me/email', auth, async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body;
    if (!currentPassword || !newEmail) {
      return res.status(400).json({ error: 'Senha atual e novo email são obrigatórios' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Senha atual incorreta' });

    const normalized = newEmail.trim().toLowerCase();
    const exists = await User.findOne({ email: normalized, _id: { $ne: user._id } }).lean();
    if (exists) return res.status(409).json({ error: 'Email já está em uso' });

    user.email = normalized;
    await user.save();
    res.json({ message: 'Email atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar email' });
  }
});

// PUT: alterar senha
router.put('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Senha atual incorreta' });

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar senha' });
  }
});

module.exports = router;