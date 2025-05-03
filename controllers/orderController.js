const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== 'employee') return res.status(403).send('Acesso negado.');

    const restaurantId = req.user.restaurant;
    if (!restaurantId) return res.status(400).send('Empregado sem restaurante associado.');

    const { items } = req.body;
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const newOrder = new Order({
      employee: req.user._id,
      restaurant: restaurantId,
      items,
      total
    });

    await newOrder.save();
    res.redirect('/orders'); // Ou onde quiseres
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar pedido.');
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find({ employee: req.user._id }).populate('restaurant');
    res.render('order/orderList', { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar pedidos.');
  }
};
