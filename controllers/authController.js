const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.render('login', { error: 'Utilizador não encontrado.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render('login', { error: 'Palavra-passe incorreta.' });

    req.session.user = user;
    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Erro ao autenticar.' });
  }
};

exports.getRegister = (req, res) => {
  res.render('register', { error: null });
};

exports.postRegister = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.render('login', { error: 'Utilizador já existe.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: 'cliente' });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Erro ao registar.' });
  }
};

exports.getDashboard = (req, res) => {
  res.render('dashboard', { error: null });
};
