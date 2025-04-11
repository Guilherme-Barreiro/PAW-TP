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

exports.viewPrato = async (req, res) => {
  try {
    const { id, pratoId } = req.params;

    const restaurante = await Restaurant.findById(id);
    if (!restaurante) {
      return res.status(404).render('error', { message: 'Restaurante não encontrado' });
    }

    const prato = restaurante.menu[pratoId];
    if (!prato) {
      return res.status(404).render('error', { message: 'Prato não encontrado' });
    }

    res.render('viewPrato', { prato });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Erro ao procurar o prato' });
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
    const restaurante = await Restaurant.findById(req.params.id);
    const index = parseInt(req.params.pratoIndex);

    if (!restaurante || !restaurante.menu[index]) {
      return res.status(404).send('Prato não encontrado');
    }

    // Se há nova imagem, apagar a anterior
    if (imageFile) {
        // apaga a anterior
        const oldImage = restaurante.menu[index].image;
        if (oldImage) {
          const oldPath = path.join(__dirname, '../public/images/pratos', oldImage);
          fs.unlink(oldPath, (err) => {
            if (err) console.error('Erro ao apagar imagem antiga:', err);
          });
        }
 
        restaurante.menu[index].image = imageFile;
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
};

exports.postRemoveMenu = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    const pratoIndex = req.params.pratoIndex;

    if (!restaurante || !restaurante.menu[pratoIndex]) {
      return res.status(404).send('Prato não encontrado');
    }

    const prato = restaurante.menu[pratoIndex];

    // Apagar imagem do prato do sistema de ficheiros
    if (prato.image) {
      const imagePath = path.join(__dirname, '../public/images/pratos', prato.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Erro ao apagar imagem do prato:', err);
      });
    }

    restaurante.menu.splice(pratoIndex, 1);
    await restaurante.save();

    res.redirect(`/restaurants/${req.params.id}/manage`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao remover prato');
  }
};
