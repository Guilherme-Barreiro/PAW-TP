const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  validado: Boolean,
  menu: [{
    name: String,
    category: String,
    description: String,
    image: String,
    nutrition: String,
    price: Number
  }]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
