const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  restaurantName: String, 
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  clientName: String,

  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  items: [{
    dish: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    subtotal: Number,
    tipo: String
  }],
  total: Number,
  tempoTotal: Number,
  status: {
    type: String,
    enum: ['pending', 'preparing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  cancelado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
