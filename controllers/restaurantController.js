const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category'); 
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getNutritionalInfo } = require('../utils/spoonacular');

const parseNutri = (val) => {
  const num = parseFloat(val);
  return !isNaN(num) && num >= 0 ? num : null;
};

exports.postRegister = async (req, res) => {
  const { name, email, password, location } = req.body;

  // ✅ Verifica se o utilizador está autenticado
  if (!req.user || !req.user._id) {
    return res.status(401).send('Utilizador não autenticado');
  }

  try {
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
      return res.status(400).send('O nome do restaurante só pode conter letras e espaços.');
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(location)) {
      return res.status(400).send('A localização só pode conter letras e espaços.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send('O email introduzido não é válido.');
    }

    const restauranteExistente = await Restaurant.findOne({ email });
    if (restauranteExistente) {
      return res.status(400).send('Já existe um restaurante com este email.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const novoRestaurante = new Restaurant({
      name,
      email,
      password: hashedPassword,
      location,
      validado: false,
      createdBy: req.user._id // ✅ AQUI está a ligação com o utilizador autenticado
    });

    await novoRestaurante.save();
    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao registar restaurante');
  }
};

exports.getList = async (req, res) => {
  try {
    const { name, category, location, min, max } = req.query;

    const filtro = {};
    if (name) filtro.name = { $regex: name, $options: 'i' };
    if (category) filtro['menu.category'] = category;
    if (location) filtro.location = { $regex: location, $options: 'i' };

    if (min || max) {
      filtro['menu.price.inteira'] = {};
      if (min) filtro['menu.price.inteira'].$gte = parseFloat(min);
      if (max) filtro['menu.price.inteira'].$lte = parseFloat(max);
    }

    const restaurantes = await Restaurant.find(filtro);

    const categoriasDB = await Category.find({}).select('name -_id');
    const categoriasUnicas = categoriasDB.map(cat => cat.name);

    const categoriasFixas = ["Carne", "Peixe", "Vegetariano", "Sobremesa"];
    const categorias = [...new Set([...categoriasFixas, ...categoriasUnicas])];

    res.render('restaurant/restaurantList', {
      restaurantes,
      categorias,
      filtros: req.query,
      title: 'Lista de restaurantes'
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar restaurantes');
  }
};


exports.getAddMenu = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    res.render('menus/addMenu', { restaurante, title: 'Adicionar novo prato' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar formulário de menu');
  }
};

exports.getManage = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    res.render('restaurant/restaurantManage', { restaurante, title: 'Gerir restaurante' });
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
    res.render('menus/editMenu', {
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

exports.getFilteredList = async (req, res) => {
  try {
    const { category, priceMin, priceMax, location, name, orderBy } = req.query;
    const query = {};

    if (category) query['menu.category'] = category;
    if (location) query.location = { $regex: new RegExp(location, 'i') };
    if (name) query.name = { $regex: new RegExp(name, 'i') };

    if (priceMin || priceMax) {
      query['menu.price.inteira'] = {};
      if (priceMin) query['menu.price.inteira'].$gte = parseFloat(priceMin);
      if (priceMax) query['menu.price.inteira'].$lte = parseFloat(priceMax);
    }

    let restaurantes = await Restaurant.find(query);

    if (orderBy === 'preco') {
      restaurantes.sort((a, b) => a.menu[0]?.price?.inteira - b.menu[0]?.price?.inteira);
    } else if (orderBy === 'nome') {
      restaurantes.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.render('restaurant/filter', { restaurantes, title: 'Homepage com Filtros' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao aplicar filtros');
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
    res.render('restaurant/viewPrato', {
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

exports.viewMenu = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    const menu = restaurante.menu;

    if (!menu || menu.length === 0) {
      return res.render('restaurant/viewMenu', {
        restaurante,
        menu: [],
        title: restaurante.name,
        msg: 'Este restaurante ainda não tem pratos registados.'
      });
    }

    res.render('restaurant/viewMenu', {
      restaurante,
      menu,
      title: restaurante.name,
      msg: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar os pratos');
  }
};

exports.postAddMenu = async (req, res) => {
  const { name, category, description, meia, inteira } = req.body;
  const image = req.file ? req.file.filename : '';

  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    if (restaurante.menu.length >= 10) {
      return res.status(400).send('Este restaurante já tem o máximo de 10 pratos.');
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
      return res.status(400).send('O nome do prato só pode conter letras e espaços.');
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(category)) {
      return res.status(400).send('A categoria só pode conter letras e espaços.');
    }

    const meiaF = parseFloat(meia);
    const inteiraF = parseFloat(inteira);

    if (isNaN(meiaF) || isNaN(inteiraF) || meiaF < 0 || inteiraF < 0 || meiaF > inteiraF) {
      return res.status(400).send('Verifica os preços: sem negativos, e meia dose deve ser menor ou igual à dose inteira.');
    }

    const nutritionData = await getNutritionalInfo(name);
    const nutrition = nutritionData
      ? `Calorias: ${nutritionData.calories?.value} ${nutritionData.calories?.unit}, Proteínas: ${nutritionData.protein?.value} ${nutritionData.protein?.unit}, Gordura: ${nutritionData.fat?.value} ${nutritionData.fat?.unit}`
      : 'Informação nutricional não disponível.';

    restaurante.menu.push({
      name,
      category,
      description,
      image,
      nutrition,
      price: {
        meia: meiaF,
        inteira: inteiraF
      }
    });

    await restaurante.save();
    res.redirect(`/restaurants/${req.params.id}/manage`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao adicionar prato');
  }
};

exports.postEditMenu = async (req, res) => {
  const { name, category, description, meia, inteira } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    const prato = restaurante.menu[req.params.pratoIndex];
    if (!prato) return res.status(404).send('Prato não encontrado');

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
      return res.status(400).send('O nome do prato só pode conter letras e espaços.');
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(category)) {
      return res.status(400).send('A categoria só pode conter letras e espaços.');
    }

    const meiaF = parseFloat(meia);
    const inteiraF = parseFloat(inteira);

    if (isNaN(meiaF) || isNaN(inteiraF) || meiaF < 0 || inteiraF < 0 || meiaF > inteiraF) {
      return res.status(400).send('Verifica os preços: sem negativos, e meia dose deve ser menor ou igual à dose inteira.');
    }

    const nomeAlterado = name !== prato.name;

    prato.name = name;
    prato.category = category;
    prato.description = description;
    prato.price.meia = meiaF;
    prato.price.inteira = inteiraF;
    if (image) prato.image = image;

    if (nomeAlterado) {
      const nutritionData = await getNutritionalInfo(name);
      prato.nutrition = nutritionData
        ? `Calorias: ${nutritionData.calories?.value} ${nutritionData.calories?.unit}, Proteínas: ${nutritionData.protein?.value} ${nutritionData.protein?.unit}, Gordura: ${nutritionData.fat?.value} ${nutritionData.fat?.unit}`
        : 'Informação nutricional não disponível.';
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

exports.getEditRestaurant = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    res.render('restaurant/editRestaurant', { restaurante, title: 'Editar Restaurante' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar restaurante para edição');
  }
};

exports.postEditRestaurant = async (req, res) => {
  const { name, email, location } = req.body;

  try {
    // Validações
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
      return res.status(400).send('O nome do restaurante só pode conter letras e espaços.');
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(location)) {
      return res.status(400).send('A localização só pode conter letras e espaços.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send('O email introduzido não é válido.');
    }

    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    restaurante.name = name;
    restaurante.email = email;
    restaurante.location = location;

    await restaurante.save();
    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar restaurante');
  }
};

exports.postDeleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao eliminar restaurante');
  }
};

exports.validateRestaurant = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    restaurante.validado = true;
    await restaurante.save();

    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao validar restaurante');
  }
};

exports.getRegister = (req, res) => {
  res.render('restaurant/restaurantRegister', {
    title: 'Registar Restaurante',
    error: null
  });
};