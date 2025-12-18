const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // << novo
  nome: { type: String, required: true },
  idade: String,
  tipo: { type: String, enum: ['Cachorro', 'Gato'], required: true },
  raca: String,
  peso: String,
  cor: String,
  nomeTutor: String,
  cpfTutor: String,
  dataCadastro: String,
  imagem: String,
  localizacao: {
    latitude: Number,
    longitude: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);