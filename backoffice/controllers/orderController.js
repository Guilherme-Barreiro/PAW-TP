const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== 'employee') return res.status(403).send('Acesso negado.');

    const restaurant = await Restaurant.findById(req.user.restaurant);
    if (!restaurant) return res.status(400).send('Restaurante não encontrado.');

    const { items } = req.body; // [{ dishId, quantity }]

    const populatedItems = items.map(item => {
      const prato = restaurant.menu.id(item.dishId);
      if (!prato) throw new Error(`Prato com ID ${item.dishId} não encontrado no restaurante.`);

      return {
        dishId: prato._id,
        name: prato.name,
        quantity: item.quantity,
        price: prato.price.inteira,
        subtotal: prato.price.inteira * item.quantity
      };
    });

    const total = populatedItems.reduce((acc, item) => acc + item.subtotal, 0);

    const newOrder = new Order({
      employee: req.user._id,
      restaurant: restaurant._id,
      items: populatedItems.map(({ dishId, quantity }) => ({ dish: dishId, quantity })),
      total,
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
      .lean();

    // Para cada pedido, tenta mostrar o nome do prato com base no menu do restaurante
    for (const order of orders) {
      const restaurant = await Restaurant.findById(order.restaurant._id);
      order.items = order.items.map(item => {
        const prato = restaurant.menu.id(item.dish);
        return {
          ...item,
          name: prato ? prato.name : 'Prato removido',
          price: prato?.price?.inteira ?? 0
        };
      });
    }

    res.render('order/orderList', { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar pedidos.');
  }
};

exports.showCreateForm = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.restaurant);
    if (!restaurant) return res.status(404).send('Restaurante não encontrado.');

    const dishes = restaurant.menu;

    res.render('order/createOrder', { dishes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar pratos.');
  }
};
