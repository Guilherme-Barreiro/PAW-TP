const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// ======= Middleware: verifica o token da sessão =======
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


// ======= GET /login =======
exports.getLogin = (req, res) => {
  res.render('login', { error: null, title: 'Login' });
};

// ======= POST /login =======
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.render('login', { error: 'Utilizador não encontrado.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render('login', { error: 'Palavra-passe incorreta.' });

    // Criar token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Guardar o token num cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000 // 2 horas
    });

    req.session.user = user;

    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Erro ao autenticar.' });
  }
};

// ======= GET /register =======
exports.getRegister = (req, res) => {
  res.render('register', { error: null });
};

// ======= POST /register =======
exports.postRegister = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.render('login', { error: 'Utilizador já existe.' });

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
    res.render('login', { error: 'Erro ao registar.' });
  }
};

// ======= GET /logout =======
exports.logout = (req, res) => {
  res.clearCookie('token'); // remove o cookie JWT
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao terminar sessão:', err);
      return res.status(500).send('Erro ao fazer logout');
    }

    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};


// ======= GET /dashboard =======
exports.getDashboard = (req, res) => {
  res.render('dashboard', { error: null });
};

// ======= GET /profile =======
exports.getProfile = (req, res) => {
  const user = req.session.user;

  if (!user) return res.redirect('/login');

  res.render('profile', { user });
};
