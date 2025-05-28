const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/^[A-Za-z]+$/, 'O nome de utilizador só pode conter letras.']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'A palavra-passe deve ter pelo menos 6 caracteres.']
  },
  role: {
    type: String,
    enum: ['cliente', 'admin', 'employee'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Email inválido.']
  },
  nomeCompleto: {
    type: String,
    required: true,
    match: [/^[A-Za-zÀ-ÿ\s]+$/, 'O nome completo não pode conter números ou símbolos.']
  },
  morada: {
    type: String,
    required: true,
    match: [/[A-Za-z]/, 'A morada deve conter letras.']
  },
  telefone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{9}$/, 'O telefone deve ter exatamente 9 dígitos.']
  },
  dataNascimento: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: 'A data de nascimento não pode ser no futuro.'
    }
  },
  nif: {  
    type: String,
    required: true,
    unique: true,
    match: [/^\d{9}$/, 'O NIF deve ter exatamente 9 dígitos.']
  },
  historicoEncomendas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },

  // ✅ Novos campos para bloqueio por cancelamento
  cancelamentos: [{
    type: Date,
    default: []
  }],
  bloqueadoAte: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);
