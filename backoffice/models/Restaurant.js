// Conexão à base de dados do MongoDB

const mongoose = require('mongoose');

// Modelo de um restaurante

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  image: { type: String, default: 'default-restaurant.png' },
  status: {
    type: String,
    enum: ['pendente', 'validado', 'rejeitado'],
    default: 'pendente'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  raioEntrega: { type: Number, default: 5 }, // em km
  tempoEntrega: { type: Number, default: 20 }, // em minutos  
  menu: [{
    name: String,
    category: String,
    description: String,
    image: String,
    nutrition: String, 
    tempoPreparacao: { type: Number, default: 15 },
    price: {
      meia: Number,
      inteira: Number
    }    
  }]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
