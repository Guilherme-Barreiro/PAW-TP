const Restaurant = require('../models/Restaurant');

exports.getRegister = (req, res) => {
  res.render('restaurantRegister');
};

exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const novoRestaurante = new Restaurant({ name, email, password, validado: false });
    await novoRestaurante.save();
    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao registar restaurante');
  }
};

exports.getList = async (req, res) => {
  try {
    const restaurantes = await Restaurant.find();
    res.render('restaurantList', { restaurantes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar restaurantes');
  }
};

exports.getAddMenu = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    res.render('addMenu', { restaurante });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar formulário de menu');
  }
};

exports.postAddMenu = async (req, res) => {
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
};

// Outras funções como editar, remover, gerir
exports.getManage = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    res.render('restaurantManage', { restaurante });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar gestão do restaurante');
  }
};

exports.getEditMenu = async (req, res) => {
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
};

exports.postEditMenu = async (req, res) => {
  const { name, category, description, nutrition, price } = req.body;

  try {
    const restaurante = await Restaurant.findById(req.params.id);
    const index = parseInt(req.params.pratoIndex);

    if (!restaurante || !restaurante.menu[index]) {
      return res.status(404).send('Prato não encontrado');
    }

    restaurante.menu[index] = { name, category, description, nutrition, price, image: restaurante.menu[index].image };
    await restaurante.save();

    res.redirect(`/restaurants/${req.params.id}/manage`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar prato');
  }
};

exports.postRemoveMenu = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    restaurante.menu.splice(req.params.pratoIndex, 1);
    await restaurante.save();

    res.redirect(`/restaurants/${req.params.id}/manage`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao remover prato');
  }
};
