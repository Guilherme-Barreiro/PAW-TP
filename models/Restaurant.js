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
    price: {
      meia: Number,
      inteira: Number
    }    
  }]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
