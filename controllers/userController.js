const User = require('../models/User');

exports.getManage = async (req, res) => {
  try {
    const users = await User.find();
    res.render('userManage', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar utilizadores');
  }
};

exports.postDelete = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users/manage');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao apagar utilizador');
  }
};
