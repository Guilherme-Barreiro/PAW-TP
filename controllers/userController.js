const User = require('../models/User');

// Renderiza a página para gerir utilizadores que estejam autenticados à base de dados

exports.getManage = async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/userManage', { users, title: 'Gerir utilizadores' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar utilizadores');
  }
};

// Esta função retira o utilizador da base de dados

exports.postDelete = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users/manage');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao apagar utilizador');
  }
};
