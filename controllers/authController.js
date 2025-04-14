const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Verifica token da sessão 

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect('/login');

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token inválido:', err);
    return res.redirect('/login');
  }
};

exports.getLogin = (req, res) => {
  res.render('login', { error: null, showError: false, title: 'Login' });
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Utilizador não encontrado.', showError: true, title: 'Login' });
    }    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Palavra-passe incorreta.', showError: true, title: 'Login' });
    }
    
    // Cria a Token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Guarda o token numa cookie HTTP/ONLY
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000 // 2 horas
    });

    req.session.user = user;

    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Erro ao autenticar.', showError: true, title: 'Login' });
  }
};

exports.getRegister = (req, res) => {
  res.render('register', { error: null });
};

exports.postRegister = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.render('login', { error: 'Este utilizador já existe.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'cliente' // Padrão
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Erro no registo da conta.' });
  }
};

exports.logout = (req, res) => {
  // Remove o cookie JWT
  res.clearCookie('token'); 
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao terminar sessão:', err);
      return res.status(500).send('Erro ao fazer logout');
    }

    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

exports.getDashboard = (req, res) => {
  res.render('dashboard', { error: null });
};

exports.getProfile = (req, res) => {
  const user = req.session.user;

  if (!user) return res.redirect('/login');

  res.render('profile', { user });
};
