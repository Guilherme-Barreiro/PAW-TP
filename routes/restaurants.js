const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// GET - Página do formulário de registo
router.get('/register', (req, res) => {
  res.render('restaurantRegister');
});

// POST - Submeter formulário de registo
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const novoRestaurante = new Restaurant({ name, email, password });
    await novoRestaurante.save();
    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao registar restaurante');
  }
});

// GET - Listar todos os restaurantes
router.get('/list', async (req, res) => {
  try {
    const restaurantes = await Restaurant.find();
    res.render('restaurantList', { restaurantes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar restaurantes');
  }
});

// GET - Mostrar formulário para adicionar prato a restaurante
router.get('/:id/add-menu', async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    res.render('addMenu', { restaurante });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar formulário de menu');
  }
});

// POST - Adicionar prato ao array de menus do restaurante
router.post('/:id/add-menu', async (req, res) => {
  const { name, category, description, price } = req.body;

  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    // Verificar se já tem 10 pratos
    if (restaurante.menus.length >= 10) {
      return res.send('Este restaurante já tem 10 pratos no menu.');
    }

    // Adicionar novo prato
    restaurante.menus.push({ name, category, description, price });
    await restaurante.save();

    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao adicionar prato');
  }
});


module.exports = router;
