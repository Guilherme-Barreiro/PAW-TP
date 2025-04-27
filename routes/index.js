const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Redireciona para a página principal

router.get('/', async (req, res) => {
  try {
    const restaurantes = await Restaurant.find({ status: 'validado' }).limit(5);

    res.render('index', {
      title: 'Página Inicial',
      restaurantes
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar a página inicial');
  }
});

module.exports = router;
