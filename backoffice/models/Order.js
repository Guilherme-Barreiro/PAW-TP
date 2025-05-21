const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  dish: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true, min: 0 }
});

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: { type: [itemSchema], validate: [a => a.length > 0, 'Pedido não pode estar vazio'] },
  total: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'shipped', 'delivered'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Order', orderSchema);
