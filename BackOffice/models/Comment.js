const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  text: {
    type: String,
    required: [true, 'Comentário não pode estar vazio'],
    minlength: [3, 'Comentário muito curto'],
    maxlength: 300
  },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
