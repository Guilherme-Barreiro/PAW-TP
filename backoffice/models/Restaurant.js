const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: 'default-prato.png' },
  nutrition: { type: String, default: '' },
  tempoPreparacao: { type: Number, default: 15, min: 1 },
  price: {
    meia: { type: Number, min: 0, required: true },
    inteira: { type: Number, min: 0, required: true }
  }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  location: { type: String, required: true },
  image: { type: String, default: 'default-restaurant.png' },
  status: {
    type: String,
    enum: ['pendente', 'validado', 'rejeitado'],
    default: 'pendente'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  raioEntrega: { type: Number, default: 5, min: 1 },
  tempoEntrega: { type: Number, default: 20, min: 5 },
  menu: {
    type: [dishSchema],
    validate: [arrayLimit, 'O menu só pode ter até 10 pratos.']
  }
});

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('Restaurant', restaurantSchema);
