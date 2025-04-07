// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Idealmente, encriptada
  role: { type: String, enum: ['cliente', 'restaurante', 'admin'], required: true }
});

module.exports = mongoose.model('User', userSchema);
