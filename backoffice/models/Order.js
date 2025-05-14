const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      dish: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID do prato dentro do menu
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
