const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const auth = require('../middlewares/auth');

// Criar novo pet
router.post('/', auth, async (req, res) => {
  try {
    const tipo = req.body.tipo;
    const tipoNormalizado =
      tipo?.toLowerCase() === 'gato' ? 'Gato' :
      tipo?.toLowerCase() === 'cachorro' ? 'Cachorro' :
      req.body.tipo;

    const pet = new Pet({ ...req.body, tipo: tipoNormalizado, owner: req.user.id });
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar pet', details: err });
  }
});

// Listar SOMENTE meus pets
router.get('/my', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar meus pets', details: err });
  }
});

// Listar TODOS os pets — só para admins
router.get('/', auth, async (req, res) => {
  try {
    if (req.user?.role !== 'campAdmin' && req.user?.role !== 'superAdmin') {
      return res.status(403).json({ error: 'Sem permissão' });
    }
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pets', details: err });
  }
});

// Editar pet
router.put('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet não encontrado' });
    if (!pet.owner.equals(req.user.id)) return res.status(403).json({ error: 'Sem permissão' });

    const tipo = req.body.tipo;
    if (tipo) {
      req.body.tipo =
        tipo?.toLowerCase() === 'gato' ? 'Gato' :
        tipo?.toLowerCase() === 'cachorro' ? 'Cachorro' : tipo;
    }

    Object.assign(pet, req.body);
    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar pet', details: err });
  }
});

// Deletar pet
router.delete('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet não encontrado' });
    if (!pet.owner.equals(req.user.id)) return res.status(403).json({ error: 'Sem permissão' });

    await pet.deleteOne();
    res.json({ message: 'Pet removido' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao remover pet', details: err });
  }
});

module.exports = router;