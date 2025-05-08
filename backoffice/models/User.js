// Requer que esteja ligado à base de dados do MongoDB

const mongoose = require('mongoose');

// Modelo de um utilizador

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['cliente', 'admin', 'employee'],
    required: true
  },
  email: { type: String, required: true, unique: true },
  nomeCompleto: { type: String },
  morada: { type: String },
  telefone: { type: String },
  dataNascimento: { type: Date },
  nif: { type: String, required: true, unique: true },
  historicoEncomendas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
});

module.exports = mongoose.model('User', userSchema);