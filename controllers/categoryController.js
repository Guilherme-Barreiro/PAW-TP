const Category = require('../models/Category');

exports.list = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.render('categories/list', { categories });
};

exports.showCreateForm = (req, res) => {
  res.render('categories/new');
};

exports.create = async (req, res) => {
  await Category.create({ name: req.body.name });
  res.redirect('/categories');
};

exports.showEditForm = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render('categories/edit', { category });
};

exports.update = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { name: req.body.name });
  res.redirect('/categories');
};

exports.delete = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/categories');
};
