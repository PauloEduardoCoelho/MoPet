const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const { sendMail } = require('../utils/mailer');

const onlyDigits = (v = '') => String(v).replace(/\D/g, '');
const resetStore = new Map();

// LOGIN
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });

    email = String(email).trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao logar' });
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, cpf, phone, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });

    email = String(email).trim().toLowerCase();
    cpf = cpf ? onlyDigits(cpf) : undefined;
    phone = phone ? onlyDigits(phone) : undefined;

    if (cpf && cpf.length !== 11)
      return res.status(400).json({ error: 'CPF deve ter 11 dígitos.' });

    if (phone && !(phone.length === 10 || phone.length === 11))
      return res.status(400).json({ error: 'Telefone deve ter 10 ou 11 dígitos (c/ DDD).' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: 'Email já está em uso' });

    if (cpf) {
      const existingCpf = await User.findOne({ cpf });
      if (existingCpf) return res.status(409).json({ error: 'CPF já está em uso' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email,
      password: hashed,
      cpf,
      phone,
      role: role || 'user',
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Usuário criado com sucesso', token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar' });
  }
});

// CHANGE PASSWORD (logado)
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'Informe a senha atual e a nova.' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ error: 'Usuário inválido.' });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Senha atual incorreta.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Senha atualizada com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao alterar senha.' });
  }
});

// FORGOT PASSWORD (gera código e envia por e-mail)
router.post('/forgot-password', async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Informe o e-mail.' });

    email = String(email).trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'Se existir conta, um código foi enviado.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const exp = Date.now() + 10 * 60 * 1000;
    resetStore.set(email, { code, exp });

    const appName = process.env.APP_NAME || 'MoPet';
    const subject = `${appName} • Código de redefinição de senha`;
    const text = `Seu código de verificação é: ${code}. Ele expira em 10 minutos.`;
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif; max-width:520px; margin:0 auto; padding:16px;">
        <h2 style="margin:0 0 12px; color:#333;">${appName}</h2>
        <p style="color:#333;">Você solicitou a redefinição da sua senha.</p>
        <p style="color:#333;">Use o código abaixo (expira em 10 minutos):</p>
        <div style="font-size:28px; font-weight:bold; letter-spacing:4px; padding:12px 16px; background:#f6f6f6; border-radius:8px; text-align:center; color:#111;">
          ${code}
        </div>
        <p style="color:#555; font-size:14px;">Se você não fez essa solicitação, ignore este e-mail.</p>
      </div>
    `;

    await sendMail({ to: email, subject, text, html }); // ⬅️ envio real

    res.json({ message: 'Código enviado para seu e-mail.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao iniciar recuperação de senha.' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    let { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword)
      return res.status(400).json({ error: 'Email, código e nova senha são obrigatórios.' });

    email = String(email).trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuário inválido.' });

    const entry = resetStore.get(email);
    if (!entry) return res.status(400).json({ error: 'Código inválido ou expirado.' });
    if (entry.code !== String(code)) return res.status(400).json({ error: 'Código incorreto.' });
    if (Date.now() > entry.exp) {
      resetStore.delete(email);
      return res.status(400).json({ error: 'Código expirado.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    resetStore.delete(email);
    res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao redefinir senha.' });
  }
});

// util p/ testes
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