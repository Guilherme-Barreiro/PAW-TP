const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

router.get('/', async (req, res) => {
  try {
    const restaurantes = await Restaurant.find().limit(5); // Mostra os 5 primeiros
    res.render('index', { title: 'Página Inicial', restaurantes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar a página inicial');
  }
});

module.exports = router;
