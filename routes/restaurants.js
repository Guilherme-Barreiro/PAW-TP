const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const upload = require('../utils/multerConfig');

router.get('/register', (req, res) => {
  res.render('restaurantRegister');
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const novoRestaurante = new Restaurant({
      name,
      email,
      password,
      validado: false
    });
    await novoRestaurante.save();
    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao registar restaurante');
  }
});

router.get('/list', async (req, res) => {
  try {
    const restaurantes = await Restaurant.find();
    res.render('restaurantList', { restaurantes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar restaurantes');
  }
});

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

router.post('/:id/add-menu', upload.single('image'), async (req, res) => {
  const { name, category, description, nutrition, price } = req.body;
  const image = req.file ? req.file.filename : '';

  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    if (restaurante.menu.length >= 10) {
      return res.send('Este restaurante já tem 10 pratos no menu.');
    }

    restaurante.menu.push({ name, category, description, image, nutrition, price });
    await restaurante.save();

    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao adicionar prato');
  }
});


router.get('/:id/manage', async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    res.render('restaurantManage', { restaurante });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar gestão do restaurante');
  }
});

module.exports = router;
