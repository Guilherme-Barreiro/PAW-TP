const User = require('../../models/User');

// GET /api/users - Listar todos os utilizadores
exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar utilizadores.' });
  }
};

// DELETE /api/users/:id - Eliminar utilizador
exports.remove = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    res.json({ message: 'Utilizador eliminado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao apagar utilizador.' });
  }
};
