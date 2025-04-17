const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['cliente', 'restaurante', 'admin'],
    required: true
  },
  email: { type: String, required: true, unique: true },
  nomeCompleto: { type: String },
  morada: { type: String },
  telefone: { type: String },
  dataNascimento: { type: Date },
  nif: { type: String, required: true, unique: true },

  historicoEncomendas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],

  validado: { type: Boolean, default: false },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }]
});

module.exports = mongoose.model('User', userSchema);