const router = require('express').Router();
const auth = require('../middlewares/auth');
const Campaign = require('../models/Campaign');

const onlyDigits = (v = '') => String(v).replace(/\D/g, '');
const isManager = (role) => role === 'manager' || role === 'superadmin';

// LISTAR campanhas (público)
router.get('/', async (_req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 });
  res.json(campaigns);
});

// DETALHE da campanha (com inscritos populados)
router.get('/:id', async (req, res) => {
  const c = await Campaign.findById(req.params.id)
    .populate('enrollments.pet', 'nome raca tipo imagem')
    .populate('enrollments.owner', 'name email phone cpf');

  if (!c) return res.status(404).json({ error: 'Campanha não encontrada.' });
  res.json(c);
});

// CRIAR campanha (apenas gerente/superadmin)
router.post('/', auth, async (req, res) => {
  try {
    if (!isManager(req.user.role)) {
      return res.status(403).json({ error: 'Apenas gerente/superadmin podem criar campanhas.' });
    }

    let { cep, day, time, capacity, address, number, placeName, reference } = req.body;

    if (!cep || !day || !time || !capacity) {
      return res.status(400).json({ error: 'CEP, dia, hora e capacidade são obrigatórios.' });
    }

    cep = onlyDigits(cep);
    if (cep.length !== 8) return res.status(400).json({ error: 'CEP inválido. Use 8 dígitos.' });

    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return res.status(400).json({ error: 'Dia inválido. Use YYYY-MM-DD.' });
    }

    if (!/^\d{2}:\d{2}(-\d{2}:\d{2})?$/.test(time)) {
      return res.status(400).json({ error: 'Hora inválida. Use HH:mm ou HH:mm-HH:mm.' });
    }

    capacity = Number(capacity);
    if (!Number.isFinite(capacity) || capacity < 1) {
      return res.status(400).json({ error: 'Capacidade deve ser >= 1.' });
    }

    const safeAddress = address
      ? {
          street: address.street || '',
          neighborhood: address.neighborhood || '',
          city: address.city || '',
          state: address.state || '',
        }
      : undefined;

    const campaign = await Campaign.create({
      cep,
      day,
      time,
      capacity,
      address: safeAddress,
      number: number || '',
      placeName: placeName || '',
      reference: reference || '',
      createdBy: req.user.id,
    });

    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar campanha.' });
  }
});

// INSCREVER pet
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const { petId } = req.body;
    if (!petId) return res.status(400).json({ error: 'petId é obrigatório.' });

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada.' });

    const already = campaign.enrollments.some((e) => String(e.pet) === String(petId));
    if (already) return res.status(200).json({ message: 'Pet já inscrito.' });

    if (campaign.enrollments.length >= campaign.capacity) {
      return res.status(400).json({ error: 'Capacidade esgotada.' });
    }

    campaign.enrollments.push({ pet: petId, owner: req.user.id });
    await campaign.save();

    res.json({ message: 'Inscrição realizada.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao inscrever.' });
  }
});

// REMOVER inscrição (dono do pet OU gerente/superadmin)
router.delete('/:id/enroll/:petId', auth, async (req, res) => {
  try {
    const { id, petId } = req.params;

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada.' });

    const entry = campaign.enrollments.find((e) => String(e.pet) === String(petId));
    if (!entry) return res.status(404).json({ error: 'Inscrição não encontrada.' });

    const canRemove = isManager(req.user.role) || String(entry.owner) === String(req.user.id);
    if (!canRemove) return res.status(403).json({ error: 'Sem permissão para remover esta inscrição.' });

    campaign.enrollments = campaign.enrollments.filter((e) => String(e.pet) !== String(petId));
    await campaign.save();

    res.json({ message: 'Inscrição removida.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao remover inscrição.' });
  }
});

// EXCLUIR campanha (apenas gerente/superadmin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!isManager(req.user.role)) {
      return res.status(403).json({ error: 'Apenas gerente/superadmin podem excluir campanhas.' });
    }
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada.' });

    await campaign.deleteOne();
    res.json({ message: 'Campanha excluída.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao excluir campanha.' });
  }
});

module.exports = router;