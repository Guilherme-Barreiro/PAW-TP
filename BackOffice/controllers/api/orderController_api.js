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

    const newOrder = new Order({
      restaurant: restaurant._id,
      employee: role === 'employee' ? userId : undefined,
      client: role === 'cliente' ? userId : undefined,
      items: populatedItems,
      total
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
