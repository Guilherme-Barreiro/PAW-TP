const Order = require('../models/Order');
const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');

exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== 'employee') return res.status(403).send('Acesso negado.');

    const restaurantId = req.user.restaurant;
    if (!restaurantId) return res.status(400).send('Empregado sem restaurante associado.');

    const { items } = req.body;

    const populatedItems = await Promise.all(items.map(async (item) => {
      const dish = await Dish.findById(item.dish);
      if (!dish) throw new Error(`Prato com ID ${item.dish} não encontrado.`);
      return {
        dish: dish._id,
        quantity: item.quantity,
        price: dish.price,
        subtotal: dish.price * item.quantity
      };
    }));

    const total = populatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const newOrder = new Order({
      employee: req.user._id,
      restaurant: restaurantId,
      items: populatedItems.map(({ dish, quantity }) => ({ dish, quantity })),
      createdAt: new Date()
    });

    await newOrder.save();
    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar pedido.');
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find({ employee: req.user._id })
      .populate('restaurant')
      .populate('items.dish');
    
    res.render('order/orderList', { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar pedidos.');
  }
};

exports.showCreateForm = async (req, res) => {
  try {
    const dishes = await Dish.find({ restaurant: req.user.restaurant });
    res.render('order/createOrder', { dishes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar pratos.');
  }
};
