const Restaurant = require('../models/Restaurant');
const fs = require('fs');
const path = require('path');

// ============ GETs ============

exports.getRegister = (req, res) => {
  res.render('restaurantRegister', { title: 'Registo do novo restaurante' });
};

exports.getList = async (req, res) => {
  try {
    const restaurantes = await Restaurant.find();
    res.render('restaurantList', { restaurantes, title: 'Lista de restaurantes' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar restaurantes');
  }
};

exports.getAddMenu = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    res.render('addMenu', { restaurante, title: 'Adicionar novo prato' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar formulário de menu');
  }
};

exports.getManage = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    res.render('restaurantManage', { restaurante, title: 'Gerir restaurantes' });
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
    res.render('editMenu', {
      restauranteId: restaurante._id,
      pratoIndex: index,
      prato,
      title: 'Editar Prato'
    });

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
      pratoIndex: index,
      title: `Visualizar ${prato.name}`
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
  const { name, category, description, nutrition, pequena, media, grande } = req.body;
  const image = req.file ? req.file.filename : '';

  // Verifica se os preços são válidos números
  const precoPequena = parseFloat(pequena);
  const precoMedia = parseFloat(media);
  const precoGrande = parseFloat(grande);

  if (isNaN(precoPequena) || isNaN(precoMedia) || isNaN(precoGrande)) {
    console.error('Preços inválidos:', pequena, media, grande);
    return res.status(400).send('Preços inválidos. Certifica-te que são valores numéricos.');
  }

  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    if (restaurante.menu.length >= 10) {
      return res.send('Este restaurante já tem 10 pratos no menu.');
    }

    restaurante.menu.push({
      name,
      category,
      description,
      image,
      nutrition,
      price: {
        pequena: precoPequena,
        media: precoMedia,
        grande: precoGrande
      }
    });

    await restaurante.save();
    res.redirect(`/restaurants/${req.params.id}/manage`);

  } catch (err) {
    console.error('Erro ao adicionar prato:', err);
    res.status(500).send('Erro ao adicionar prato');
  }
};

exports.postEditMenu = async (req, res) => {
  const { name, category, description, nutrition, pequena, media, grande } = req.body;
  const imageFile = req.file ? req.file.filename : null;

  // Validar preços
  const precoPequena = parseFloat(pequena);
  const precoMedia = parseFloat(media);
  const precoGrande = parseFloat(grande);

  if (isNaN(precoPequena) || isNaN(precoMedia) || isNaN(precoGrande)) {
    console.error('Preços inválidos:', pequena, media, grande);
    return res.status(400).send('Preços inválidos. Certifica-te que são valores numéricos.');
  }

  try {
    const index = parseInt(req.params.pratoIndex);
    const restaurante = await Restaurant.findById(req.params.id);

    if (!restaurante || isNaN(index) || !restaurante.menu[index]) {
      return res.status(404).send('Prato não encontrado');
    }

    const prato = restaurante.menu[index];

    // Atualizar dados
    prato.name = name;
    prato.category = category;
    prato.description = description;
    prato.nutrition = nutrition;
    prato.price = {
      pequena: precoPequena,
      media: precoMedia,
      grande: precoGrande
    };

    if (req.file) {
      const oldPath = path.join(__dirname, '../public/images/pratos', prato.image);
      fs.unlink(oldPath, err => {
        if (err) console.error('Erro ao apagar imagem antiga:', err);
      });

      prato.image = imageFile;
    }

    await restaurante.save();
    res.redirect(`/restaurants/${req.params.id}/manage`);

  } catch (err) {
    console.error('Erro ao atualizar prato:', err);
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

    if (prato.image) {
      const imagePath = path.join(__dirname, '../public/images/pratos', prato.image);
      fs.unlink(imagePath, err => {
        if (err) console.error('Erro ao apagar imagem do prato:', err);
      });
    }

    restaurante.menu.splice(index, 1);
    await restaurante.save();

    res.redirect(`/restaurants/${req.params.id}/manage`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao remover prato');
  }
};