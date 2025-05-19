const Order = require('../../models/Order');
const Restaurant = require('../../models/Restaurant');
const jwt = require('jsonwebtoken');

// Criar pedido (cliente ou funcionário)
exports.create = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;
    const role = decoded.role;

    // Podes ajustar isto conforme a lógica de obtenção do restaurante
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) return res.status(400).send('Restaurante não encontrado.');

    const { items } = req.body;

    const populatedItems = items.map(item => {
      const prato = restaurant.menu.id(item.dish); // <- aqui o fix
      if (!prato) throw new Error(`Prato ${item.dish} não encontrado no menu.`);
      return {
        dish: prato._id,
        name: prato.name,
        price: prato.price?.inteira ?? 0,
        quantity: item.quantity,
        subtotal: (prato.price?.inteira ?? 0) * item.quantity
      };
    });


    const total = populatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    if (total <= 0) {
      return res.status(400).json({ error: 'O total do pedido deve ser maior que zero.' });
    }

    const tempos = items.map(item => {
    const prato = restaurant.menu.id(item.dish);
    return prato?.tempoPreparacao || 0;
    });
    const tempoPreparacaoTotal = Math.max(...tempos);
    const tempoEntrega = restaurant.tempoEntrega || 15;
    const tempoTotal = tempoPreparacaoTotal + tempoEntrega;

    const newOrder = new Order({
      restaurant: restaurant._id,
      employee: role === 'employee' ? userId : undefined,
      client: role === 'cliente' ? userId : undefined,
      items: populatedItems,
      total,
      tempoTotal
    });

    await newOrder.save();
    res.status(201).json({ message: 'Pedido criado com sucesso.', order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar pedido.');
  }
};

// Listar pedidos do utilizador autenticado
exports.getAll = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;
    const role = decoded.role;

    const filtro = role === 'employee' ? { employee: userId } : { client: userId };

    const orders = await Order.find(filtro)
      .populate('restaurant')
      .lean();

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar pedidos.');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verifica se o user é restaurante (simplificado)
    if (!req.user || req.user.role !== 'restaurant') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    return res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};