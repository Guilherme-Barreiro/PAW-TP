const Restaurant = require('../models/Restaurant');
const fs = require('fs');
const path = require('path');

// ============ GETs ============

exports.getRegister = (req, res) => {
  res.render('restaurantRegister');
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
    const index = parseInt(req.params.pratoIndex);

    if (!restaurante || isNaN(index) || !restaurante.menu[index]) {
    return res.status(404).send('Prato não encontrado');
  }

  const prato = restaurante.menu[index];
  res.render('editMenu', { restauranteId: restaurante._id, pratoIndex: index, prato });

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar prato para edição');
  }
};

exports.viewPrato = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    const index = parseInt(req.params.pratoIndex);

    if (!restaurante || isNaN(index) || !restaurante.menu[index]) {
      return res.status(404).send('Prato não encontrado');
    }

    const prato = restaurante.menu[index];
    res.render('viewPrato', {
      prato,
      restauranteId: restaurante._id,
      pratoIndex: index
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar o prato');
  }
};


// ============ POSTs ============

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

exports.postEditMenu = async (req, res) => {
  const { name, category, description, nutrition, price } = req.body;
  const imageFile = req.file ? req.file.filename : null;

  try {
    const index = parseInt(req.params.pratoIndex);
const restaurante = await Restaurant.findById(req.params.id);

if (!restaurante || isNaN(index) || !restaurante.menu[index]) {
  return res.status(404).send('Prato não encontrado');
}

const prato = restaurante.menu[index];

// Atualizar campos
prato.name = req.body.name;
prato.category = req.body.category;
prato.description = req.body.description;
prato.nutrition = req.body.nutrition;
prato.price = req.body.price;

if (req.file) {
  // Apagar imagem anterior
  const oldPath = path.join(__dirname, '../public/images/pratos', prato.image);
  fs.unlink(oldPath, err => {
    if (err) console.error('Erro ao apagar imagem antiga:', err);
  });

  prato.image = req.file.filename;
}

await restaurante.save();
res.redirect(`/restaurants/${req.params.id}/manage`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar prato');
  }
};

exports.postRemoveMenu = async (req, res) => {
  try {
    const index = parseInt(req.params.pratoIndex);
const restaurante = await Restaurant.findById(req.params.id);

if (!restaurante || isNaN(index) || !restaurante.menu[index]) {
  return res.status(404).send('Prato não encontrado');
}

const prato = restaurante.menu[index];

// Apagar imagem
if (prato.image) {
  const imagePath = path.join(__dirname, '../public/images/pratos', prato.image);
  fs.unlink(imagePath, err => {
    if (err) console.error('Erro ao apagar imagem do prato:', err);
  });
}

// Remover prato
restaurante.menu.splice(index, 1);
await restaurante.save();

res.redirect(`/restaurants/${req.params.id}/manage`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao remover prato');
  }
};
