const Category = require('../../models/Category');

// GET /api/categories - Lista todas as categorias
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar categorias.' });
  }
};

// GET /api/categories/:id - Buscar categoria por ID
exports.getOne = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada.' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar categoria.' });
  }
};

// POST /api/categories - Criar nova categoria
exports.create = async (req, res) => {
  try {
    const novaCategoria = new Category({ name: req.body.name });
    await novaCategoria.save();
    res.status(201).json(novaCategoria);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar categoria.' });
  }
};

// PUT /api/categories/:id - Atualizar categoria
exports.update = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Categoria não encontrada.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar categoria.' });
  }
};

// DELETE /api/categories/:id - Eliminar categoria
exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Categoria não encontrada.' });
    res.json({ message: 'Categoria eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao eliminar categoria.' });
  }
};
