const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const auth = require('../middlewares/auth');

// Criar novo pet
router.post('/', auth, async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar pet', details: err });
  }
});

// Listar pets
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pets' });
  }
});

module.exports = router;
