const Restaurant = require('../../models/Restaurant');
const Category = require('../../models/Category');
const User = require('../../models/User');

// GET /api/restaurants
exports.getAll = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar restaurantes.' });
  }
};

// GET /api/restaurants/:id
exports.getOne = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurante não encontrado.' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar restaurante.' });
  }
};

// POST /api/restaurants
exports.create = async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar restaurante.' });
  }
};

// PUT /api/restaurants/:id
exports.update = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Restaurante não encontrado.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar restaurante.' });
  }
};

// DELETE /api/restaurants/:id
exports.remove = async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Restaurante não encontrado.' });
    res.json({ message: 'Restaurante removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar restaurante.' });
  }
};

// GET /api/restaurants/:id/menu
exports.getMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurante não encontrado.' });
    res.json(restaurant.menu);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar o menu.' });
  }
};

// POST /api/restaurants/:id/menu
exports.addDish = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurante não encontrado.' });

    restaurant.menu.push(req.body);
    await restaurant.save();

    res.status(201).json({ message: 'Prato adicionado.', menu: restaurant.menu });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar prato.' });
  }
};

// PUT /api/restaurants/:id/menu/:index
exports.updateDish = async (req, res) => {
  try {
    const { id, index } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant || !restaurant.menu[index]) {
      return res.status(404).json({ error: 'Prato não encontrado.' });
    }

    restaurant.menu[index] = req.body;
    await restaurant.save();

    res.json({ message: 'Prato atualizado.', dish: restaurant.menu[index] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar prato.' });
  }
};

// DELETE /api/restaurants/:id/menu/:index
exports.removeDish = async (req, res) => {
  try {
    const { id, index } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant || !restaurant.menu[index]) {
      return res.status(404).json({ error: 'Prato não encontrado.' });
    }

    restaurant.menu.splice(index, 1);
    await restaurant.save();

    res.json({ message: 'Prato removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover prato.' });
  }
};

// GET /api/restaurants/filter
exports.filterRestaurants = async (req, res) => {
  try {
    const { name, category, location, min, max } = req.query;
    const filtro = { status: 'validado' };

    if (name) filtro.name = { $regex: name, $options: 'i' };
    if (category) filtro['menu.category'] = category;
    if (location) filtro.location = { $regex: location, $options: 'i' };

    if (min || max) {
      filtro['menu.price.inteira'] = {};
      if (min) filtro['menu.price.inteira'].$gte = parseFloat(min);
      if (max) filtro['menu.price.inteira'].$lte = parseFloat(max);
    }

    const restaurantes = await Restaurant.find(filtro);
    res.json(restaurantes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao aplicar filtros.' });
  }
};

// PUT /api/restaurants/:id/validate
exports.validateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurante não encontrado.' });

    restaurant.status = 'validado';
    await restaurant.save();

    res.json({ message: 'Restaurante validado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao validar restaurante.' });
  }
};

// PUT /api/restaurants/:id/reject
exports.rejectRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurante não encontrado.' });

    restaurant.status = 'recusado';
    await restaurant.save();

    res.json({ message: 'Restaurante recusado.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao recusar restaurante.' });
  }
};

// GET /api/restaurants/owner/:ownerId
exports.getByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const restaurantes = await Restaurant.find({ createdBy: ownerId });
    res.json(restaurantes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar restaurantes do utilizador.' });
  }
};

// GET /api/restaurants/pending
exports.getPending = async (req, res) => {
  try {
    const pending = await Restaurant.find({ status: 'pendente' });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar restaurantes pendentes.' });
  }
};

// GET /api/restaurants/validated
exports.getValidated = async (req, res) => {
  try {
    const validados = await Restaurant.find({ status: 'validado' });
    res.json(validados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar restaurantes validados.' });
  }
};

// POST /api/restaurants/:id/menu/:index/image
exports.uploadDishImage = async (req, res) => {
  try {
    const { id, index } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant || !restaurant.menu[index]) {
      return res.status(404).json({ error: 'Prato ou restaurante não encontrado.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum ficheiro enviado.' });
    }

    restaurant.menu[index].image = req.file.filename;
    await restaurant.save();

    res.json({ message: 'Imagem atualizada com sucesso.', image: req.file.filename });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar imagem do prato.' });
  }
};

// GET /api/admin/dashboard
exports.adminDashboard = async (req, res) => {
  try {
    const totalRestaurants = await Restaurant.countDocuments({ status: 'validado' });

    const totalDishesAgg = await Restaurant.aggregate([
      { $project: { count: { $size: "$menu" } } },
      { $group: { _id: null, total: { $sum: "$count" } } }
    ]);
    const totalDishes = totalDishesAgg[0]?.total || 0;

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      data: {
        totalRestaurants,
        totalDishes,
        totalUsers,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao carregar dashboard.' });
  }
};

// GET /api/restaurants/:id/menu/:index - Buscar prato por índice
exports.getDishByIndex = async (req, res) => {
  try {
    const { id, index } = req.params;
    const restaurante = await Restaurant.findById(id);
    if (!restaurante) return res.status(404).json({ error: 'Restaurante não encontrado.' });

    const idx = parseInt(index);
    if (isNaN(idx) || !restaurante.menu[idx]) {
      return res.status(404).json({ error: 'Prato não encontrado.' });
    }

    res.json({ prato: restaurante.menu[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar o prato.' });
  }
};
