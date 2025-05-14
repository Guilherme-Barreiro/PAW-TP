const Order = require('../../models/Order');
const Restaurant = require('../../models/Restaurant');

// Criar pedido
exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== 'employee') return res.status(403).send('Acesso negado.');

    const restaurant = await Restaurant.findById(req.user.restaurant);
    if (!restaurant) return res.status(400).send('Restaurante não encontrado.');

    const { items } = req.body;

    const populatedItems = items.map(item => {
      const dish = restaurant.menu.id(item.dishId); // procura pelo _id do prato dentro do menu
      if (!dish) throw new Error(`Prato com ID ${item.dishId} não encontrado no restaurante.`);
      return {
        dishId: dish._id,
        name: dish.name,
        quantity: item.quantity,
        price: dish.price.inteira,
        subtotal: dish.price.inteira * item.quantity
      };
    });

    const total = populatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const newOrder = new Order({
      employee: req.user._id,
      restaurant: restaurant._id,
      items: populatedItems.map(({ dishId, quantity }) => ({ dish: dishId, quantity })),
      total,
      createdAt: new Date()
    });

    await newOrder.save();
    res.status(201).json({ message: 'Pedido criado com sucesso.', order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar pedido.');
  }
};

// Listar pedidos do funcionário
exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find({ employee: req.user._id })
      .populate('restaurant')
      .lean();

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar pedidos.');
  }
};
