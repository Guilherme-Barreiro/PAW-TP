const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getNutritionalInfo } = require('../utils/spoonacular');
const uploadRestaurants = require('../utils/multerConfigRestaurants');

// Verifica se o utilizador é o dono do restaurante

const isOwnerOfRestaurant = (req, res, restaurante) => {
  if (!restaurante.createdBy || restaurante.createdBy.toString() !== req.session.user._id.toString()) {
    res.status(403).send('Acesso negado: não és o proprietário deste restaurante.');
    return true;
  }
  return false;
};

// Esta função converte a informação nutricional para um número

const parseNutri = (val) => {
  const num = parseFloat(val);
  return !isNaN(num) && num >= 0 ? num : null;
};

// Registo de um novo restaurante

exports.postRegister = async (req, res) => {
  const { name, location } = req.body;
  const image = req.file ? req.file.filename : 'default-restaurant.png';

  if (!req.session.user || !req.session.user._id) {
    return res.status(401).send('Utilizador não autenticado');
  }

  try {
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
      return res.status(400).send('O nome do restaurante só pode conter letras e espaços.');
    }

    // if (!/^[A-Za-zÀ-ÿ\s]+$/.test(location)) {
    //   return res.status(400).send('A localização só pode conter letras e espaços.');
    // }

    const novoRestaurante = new Restaurant({
      name,
      location,
      image,
      status: 'pendente',
      createdBy: req.session.user._id
    });

    await novoRestaurante.save();
    res.redirect('/user/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao registar restaurante');
  }
};

// Lista todos os restaurantes validados podendo usar filtros ou não, de acordo com a preferência do utilizador

exports.getList = async (req, res) => {
  try {
    const { name, category, location, min, max } = req.query;
    const sessionUser = req.session.user;

    let filtro = { status: 'validado' };

    if (name) filtro.name = { $regex: name, $options: 'i' };
    if (category) filtro['menu.category'] = category;
    if (location) filtro.location = { $regex: location, $options: 'i' };

    if (min || max) {
      filtro['menu.price.inteira'] = {};
      if (min) filtro['menu.price.inteira'].$gte = parseFloat(min);
      if (max) filtro['menu.price.inteira'].$lte = parseFloat(max);
    }

    let restaurantes = [];

    if (sessionUser) {
      const criouRestaurantes = await Restaurant.exists({ createdBy: sessionUser._id });

      if (criouRestaurantes) {
        filtro.createdBy = sessionUser._id; 
      }

      restaurantes = await Restaurant.find(filtro);
    } else {
      restaurantes = await Restaurant.find(filtro);
    }

    const categoriasDB = await Category.find({}).select('name -_id');
    const categorias = categoriasDB.map(cat => cat.name);

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

// Esta função permite adicionar um novo prato ao restaurante

exports.getAddMenu = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    if (isOwnerOfRestaurant(req, res, restaurante)) return;

    const categories = await Category.find();
    res.render('menus/addMenu', {
      restaurante,
      categories,
      title: 'Adicionar novo prato'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar formulário de menu');
  }
};

// Mostra a página para gerir o restaurante

exports.getManage = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    isOwnerOfRestaurant(req, res, restaurante);

    if (restaurante.status !== 'validado') {
      return res.status(403).send('Restaurante ainda não foi validado por um administrador.');
    }

    res.render('restaurant/restaurantManage', { restaurante, title: 'Gerir restaurante' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar gestão do restaurante');
  }
};

// Função que permite editar o menu do restaurante 

exports.getEditMenu = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    const index = parseInt(req.params.pratoIndex);

    if (!restaurante || isNaN(index) || !restaurante.menu[index]) {
      return res.status(404).send('Prato não encontrado');
    }

    if (isOwnerOfRestaurant(req, res, restaurante)) return;

    const prato = restaurante.menu[index];
    const categories = await Category.find();

    res.render('menus/editMenu', {
      restauranteId: restaurante._id,
      pratoIndex: index,
      prato,
      categories,
      title: 'Editar Prato'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar prato para edição');
  }
};

// Esta função lista de acordo com os filtros aplicados pelo utilizador (nome, localização, preço minimo, preço maximo)

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

// Página para visualizar um prato específico

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

// Esta função permite visualizar o menu do restaurante

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

// Adiciona um novo prato ao menu do restaurante

exports.postAddMenu = async (req, res) => {
  const { name, category, description, meia, inteira } = req.body;
  const image = req.file ? req.file.filename : '';

  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    isOwnerOfRestaurant(req, res, restaurante);

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

// Atualiza um prato que já exista no menu do restaurante

exports.postEditMenu = async (req, res) => {
  const { name, category, description, meia, inteira } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    isOwnerOfRestaurant(req, res, restaurante);

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
    isOwnerOfRestaurant(req, res, restaurante);

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

// Esta função permite editar dados assoaciados ao restaurante

exports.getEditRestaurant = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    isOwnerOfRestaurant(req, res, restaurante);
    res.render('restaurant/editRestaurant', { restaurante, title: 'Editar Restaurante' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar restaurante para edição');
  }
};

exports.postEditRestaurant = async (req, res) => {
  const { name, location } = req.body;
  const image = req.file ? req.file.filename : null;

  try {

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
      return res.status(400).send('O nome do restaurante só pode conter letras e espaços.');
    }

    // if (!/^[A-Za-zÀ-ÿ\s]+$/.test(location)) {
    //   return res.status(400).send('A localização só pode conter letras e espaços.');
    // }

    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    isOwnerOfRestaurant(req, res, restaurante);


    restaurante.name = name;
    restaurante.location = location;

    if (image) {
      restaurante.image = image;
    }


    await restaurante.save();
    res.redirect('/restaurants/list');

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar restaurante');
  }
};

// Permite eliminar um restaurante

exports.postDeleteRestaurant = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');
    isOwnerOfRestaurant(req, res, restaurante);
    await Restaurant.findByIdAndDelete(req.params.id);
    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao eliminar restaurante');
  }
};

// Esta função permite validar ou não validar um restaurante

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

// Mostra o formulário para a criação de um novo restaurante

exports.getRegister = (req, res) => {
  if (!req.session.user || req.session.user.role !== 'cliente') {
    return res.status(403).send('Apenas utilizadores autenticados podem criar um restaurante.');
  }

  res.render('restaurant/restaurantRegister', {
    title: 'Registar Restaurante',
    error: null
  });
};

// Lista todos os restaurantes que aguardam resposta pelo admin para serem válidos ou invalidados 

exports.listaValidacoes = async (req, res) => {
  try {
    const restaurantes = await Restaurant.find({ status: 'pendente' }).populate('createdBy');
    res.render('admin/validar', { restaurantes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar restaurantes');
  }
};

// Esta função valida o restaurante

exports.validarRestaurante = async (req, res) => {
  try {
    const restaurante = await Restaurant.findById(req.params.id);
    if (!restaurante) return res.status(404).send('Restaurante não encontrado');

    restaurante.validado = true;
    restaurante.status = 'validado';
    await restaurante.save();


    res.redirect('/admin/validar');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao validar restaurante');
  }
};

// Esta função não valida o restaurante 

exports.recusarRestaurante = async (req, res) => {
  try {
    await Restaurant.findByIdAndUpdate(req.params.id, {
      status: 'recusado',
      validado: false
    });
    res.redirect('/admin/validar');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao recusar restaurante');
  }
};

// Renderiza a dashboard do administrador com os gráficos criados

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments({ status: 'validado' });

    const totalDishesAgg = await Restaurant.aggregate([
      { $project: { menuSize: { $size: "$menu" } } },
      { $group: { _id: null, total: { $sum: "$menuSize" } } }
    ]);
    const totalDishes = totalDishesAgg[0]?.total || 0;

    const topUsers = await User.aggregate([
      { $lookup: { from: 'restaurants', localField: '_id', foreignField: 'createdBy', as: 'restaurantes' } },
      { $project: { username: 1, totalRestaurantes: { $size: "$restaurantes" } } },
      { $sort: { totalRestaurantes: -1 } },
      { $limit: 5 }
    ]);

    const topRestaurants = await Restaurant.aggregate([
      { $project: { name: 1, totalPratos: { $size: "$menu" } } },
      { $sort: { totalPratos: -1 } },
      { $limit: 5 }
    ]);

    const expensiveRestaurants = await Restaurant.aggregate([
      { $unwind: "$menu" },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          avgPrice: { $avg: "$menu.price.inteira" }
        }
      },
      { $sort: { avgPrice: -1 } },
      { $limit: 5 }
    ]);

    res.render('admin/dashboard', {
      title: 'Painel de Administração',
      totalUsers,
      totalRestaurants,
      totalDishes,
      topUsers,
      topRestaurants,
      expensiveRestaurants
    });

  } catch (err) {
    console.error('Erro no dashboard admin:', err);
    res.status(500).send('Erro ao carregar dashboard');
  }
};






