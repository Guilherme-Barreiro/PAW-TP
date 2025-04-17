const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  validado: { type: Boolean, default: false },
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
