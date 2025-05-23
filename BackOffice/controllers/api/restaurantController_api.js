const Restaurant = require('../../models/Restaurant');
const Category = require('../../models/Category');
const User = require('../../models/User');
const multer = require('multer');

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Lista todos os restaurantes
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 */
exports.getAll = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: 'validado' });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar restaurantes.' });
  }
};

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Buscar restaurante por ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do restaurante
 *     responses:
 *       200:
 *         description: Restaurante encontrado
 *       404:
 *         description: Restaurante não encontrado
 */
exports.getOne = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurante não encontrado.' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar restaurante.' });
  }
};

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Criar novo restaurante
 *     tags: [Restaurantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               tempoPreparacao:
 *                 type: number
 *               tempoEntrega:
 *                 type: number
 *               raioEntrega:
 *                 type: number
 *     responses:
 *       201:
 *         description: Restaurante criado
 *       400:
 *         description: Erro ao criar
 */
exports.create = async (req, res) => {
  try {
    const { name, location, createdBy, tempoPreparacao, tempoEntrega, raioEntrega } = req.body;

    const newRestaurant = new Restaurant({
      name,
      location,
      createdBy,
      tempoPreparacao,
      tempoEntrega,
      raioEntrega
    });

    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar restaurante.' });
  }
};

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Atualizar restaurante
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do restaurante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               tempoPreparacao:
 *                 type: number
 *               tempoEntrega:
 *                 type: number
 *               raioEntrega:
 *                 type: number
 *     responses:
 *       200:
 *         description: Restaurante atualizado
 *       404:
 *         description: Restaurante não encontrado
 */
exports.update = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Restaurante não encontrado.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar restaurante.' });
  }
};


/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Remover restaurante
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurante removido com sucesso
 *       404:
 *         description: Restaurante não encontrado
 */

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

    if (restaurant.menu.length >= 10) {
      return res.status(400).json({ error: 'O menu já tem 10 pratos.' });
    }

    const prato = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      nutrition: req.body.nutrition || '',
      tempoPreparacao: parseInt(req.body.tempoPreparacao) || 15,
      price: {
        meia: parseFloat(req.body.price_meia) || 0,
        inteira: parseFloat(req.body.price_inteira) || 0
      },
      image: req.file?.filename || 'default-prato.png'
    };

    restaurant.menu.push(prato);
    await restaurant.save();

    res.status(201).json({ message: 'Prato adicionado com imagem.', menu: restaurant.menu });
  } catch (err) {
    console.error(err);
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
