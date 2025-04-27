// Liga à base de dados do MongoDB

const mongoose = require('mongoose');

// Modelo de uma categoria

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Category', categorySchema);
