  const Order = require('../../models/Order');
  const Restaurant = require('../../models/Restaurant');
  const jwt = require('jsonwebtoken');
  const mongoose = require('mongoose');

  // Criar pedido (cliente ou funcionário)
  exports.create = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;
    const role = decoded.role;

    console.log('[REQ.BODY]', req.body);
    console.log('[USER]', decoded);

    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      console.warn('[REST NOT FOUND]', req.body.restaurant);
      return res.status(400).json({ error: 'Restaurante não encontrado.' });
    }

    const { items } = req.body;
    const populatedItems = [];

    for (const item of items) {
  const prato = restaurant.menu.id(item.dish);
  if (!prato) {
    return res.status(400).json({ error: `Prato ${item.dish} não encontrado no menu.` });
  }

  const tipo = item.tipo === 'meia' ? 'meia' : 'inteira'; // novo
  const preco = prato.price?.[tipo] ?? 0; // novo

  populatedItems.push({
    dish: prato._id,
    name: prato.name,
    price: preco,
    quantity: item.quantity,
    subtotal: preco * item.quantity,
    tipo 
  });
    }

    const total = populatedItems.reduce((sum, item) => sum + item.subtotal, 0);
    if (total <= 0) {
      return res.status(400).json({ error: 'O total do pedido deve ser maior que zero.' });
    }

    const tempos = populatedItems.map(item => {
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
    console.error('[ERRO AO CRIAR PEDIDO]', err);
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


  exports.getByRestaurant = async (req, res) => {
    try {
      const { id } = req.params;

      const orders = await Order.find({ restaurant: id })
        .populate('client', 'nomeCompleto email') // mostra dados do cliente
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (err) {
      console.error('Erro ao buscar pedidos do restaurante:', err);
      res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
  };


exports.cancelOrder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });

    // Só o cliente que fez o pedido pode cancelar
    if (order.client?.toString() !== userId) {
      return res.status(403).json({ error: 'Não tens permissão para cancelar este pedido.' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Só é possível cancelar pedidos pendentes.' });
    }

    order.status = 'cancelled';
    order.cancelado = true;
    await order.save();

    res.json({ message: 'Pedido cancelado com sucesso.', order });
  } catch (err) {
    console.error('[cancelOrder]', err);
    res.status(500).json({ error: 'Erro ao cancelar pedido.' });
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