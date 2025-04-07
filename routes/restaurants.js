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

module.exports = router;
