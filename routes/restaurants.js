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

router.get('/:id/edit-menu/:pratoIndex', async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    const pratoIndex = parseInt(req.params.pratoIndex);

    if (!restaurante || !restaurante.menu[pratoIndex]) {
      return res.status(404).send('Prato não encontrado');
    }

    const prato = restaurante.menu[pratoIndex];
    res.render('editMenu', { restauranteId: restaurante._id, pratoIndex, prato });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar prato para edição');
  }
});

router.post('/:id/edit-menu/:pratoIndex', async (req, res) => {
  const { name, category, description, nutrition, price } = req.body;

  try {
    const restaurante = await Restaurant.findById(req.params.id);
    const index = parseInt(req.params.pratoIndex);

    if (!restaurante || !restaurante.menu[index]) {
      return res.status(404).send('Prato não encontrado');
    }

    restaurante.menu[index].name = name;
    restaurante.menu[index].category = category;
    restaurante.menu[index].description = description;
    restaurante.menu[index].nutrition = nutrition;
    restaurante.menu[index].price = price;

    await restaurante.save();

    res.redirect(`/restaurants/${req.params.id}/manage`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar prato');
  }
});

router.post('/:id/remove-menu/:pratoIndex', async (req, res) => {
  const { id, pratoIndex } = req.params;

  try {
    const restaurante = await Restaurant.findById(id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    // Remover prato pelo índice
    restaurante.menu.splice(pratoIndex, 1);
    await restaurante.save();

    res.redirect(`/restaurants/${id}/manage`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao remover prato');
  }
});

module.exports = router;
