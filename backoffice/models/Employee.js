const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/^[A-Za-z]+$/, 'O nome de utilizador só pode conter letras.']
  },
  password: {
    type: String,
    required: true,
  },
  nomeCompleto: {
    type: String,
    required: true,
    match: [/^[A-Za-zÀ-ÿ\s]+$/, 'O nome não pode conter números ou símbolos.']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Email inválido.']
  },
  telefone: {
    type: String,
    required: true,
    match: [/^\d{9}$/, 'O telefone deve ter 9 dígitos.']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }]
});

module.exports = mongoose.model('Employee', employeeSchema);
