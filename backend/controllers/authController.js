const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function onlyDigits(v = '') {
  return String(v).replace(/\D/g, '');
}

exports.register = async (req, res) => {
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
      return res.status(400).json({ error: 'Telefone deve ter 10 ou 11 dígitos (DDD+número).' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(409).json({ error: 'E-mail já cadastrado.' });

    if (cpf) {
      const cpfExists = await User.findOne({ cpf });
      if (cpfExists) return res.status(409).json({ error: 'CPF já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email,
      password: passwordHash,
      cpf,
      phone,
      role: 'user',
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Usuário criado com sucesso.',
      token,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

exports.login = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    email = String(email).trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Informe a senha atual e a nova senha.' });
    }

    const user = await User.findById(userId);
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Usuário inválido.' });
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Senha atual incorreta.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Senha atualizada com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao alterar senha.' });
  }
};