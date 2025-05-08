const Category = require('../models/Category');

// Lista todas as categorias 

exports.list = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.render('categories/list', { 
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar categorias');
  }
};

// Mostra a página para criar novas cateogiras

exports.showCreateForm = (req, res) => {
  res.render('categories/new');
};

// Cria uma nova categoria 

exports.create = async (req, res) => {
  await Category.create({ name: req.body.name });
  res.redirect('/categories');
};

// Mostra o formulário para editar uma categoria existente

exports.showEditForm = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render('categories/edit', { category });
};

// Atualiza a categoria existente

exports.update = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { name: req.body.name });
  res.redirect('/categories');
};

// Elimina a categoria 

exports.delete = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/categories');
};
