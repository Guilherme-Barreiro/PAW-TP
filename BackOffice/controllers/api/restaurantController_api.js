const Restaurant = require('../../models/Restaurant');

// GET /api/restaurants - Lista todos os restaurantes
exports.getAll = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar restaurantes.' });
  }
};

// GET /api/restaurants/:id - Buscar restaurante por ID
exports.getOne = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurante não encontrado.' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar restaurante.' });
  }
};

// POST /api/restaurants - Criar novo restaurante
exports.create = async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar restaurante.' });
  }
};

// PUT /api/restaurants/:id - Atualizar restaurante
exports.update = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Restaurante não encontrado.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar restaurante.' });
  }
};

// DELETE /api/restaurants/:id - Apagar restaurante
exports.remove = async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Restaurante não encontrado.' });
    res.json({ message: 'Restaurante removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar restaurante.' });
  }
};
