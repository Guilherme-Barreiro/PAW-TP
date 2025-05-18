const Comment = require('../models/Comment');
const Order = require('../models/Order');

exports.addComment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || order.status !== 'delivered') {
      return res.status(403).json({ error: 'Only delivered orders can be commented on.' });
    }

    const newComment = new Comment({
      user: req.user._id,
      order: order._id,
      text: req.body.text,
      image: req.file?.filename
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment submitted successfully', comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving comment.' });
  }
};

exports.getCommentsByOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const comments = await Comment.find({ order: orderId }).populate('user', 'username');
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar comentários.' });
  }
};