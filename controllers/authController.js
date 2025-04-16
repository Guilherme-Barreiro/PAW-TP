const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware: Verifica token da sessão
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token inválido:', err);
    return res.redirect('/login');
  }
};

// RENDER LOGIN
exports.getLogin = (req, res) => {
  res.render('login', { error: null, showError: false, title: 'Login' });
};

// AUTENTICAÇÃO
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', {
        error: 'Utilizador não encontrado.',
        showError: true,
        title: 'Login'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', {
        error: 'Palavra-passe incorreta.',
        showError: true,
        title: 'Login'
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000
    });

    req.session.user = user;

    res.redirect('/restaurants/list');
  } catch (err) {
    console.error(err);
    res.render('login', {
      error: 'Erro ao autenticar.',
      showError: true,
      title: 'Login'
    });
  }
};

// RENDER REGISTO
exports.getRegister = (req, res) => {
  res.render('register', { error: null });
};

// REGISTO DE CONTA COM VALIDAÇÕES
exports.postRegister = async (req, res) => {
  const {
    username,
    password,
    nomeCompleto,
    email,
    morada,
    telefone,
    dataNascimento,
    nif
  } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.render('register', { error: 'Este utilizador já existe.' });
    }

    // Validações no servidor
    if (!/^[A-Za-z]+$/.test(username)) {
      return res.render('register', {
        error: 'O nome de utilizador só pode conter letras (sem espaços, números ou símbolos).'
      });
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nomeCompleto)) {
      return res.render('register', {
        error: 'O nome completo não pode conter números ou caracteres especiais.'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.render('register', { error: 'O email introduzido não é válido.' });
    }

    if (!/^\d{9}$/.test(telefone)) {
      return res.render('register', {
        error: 'O número de telefone deve ter exatamente 9 dígitos.'
      });
    }

    if (!/[A-Za-z]/.test(morada)) {
      return res.render('register', {
        error: 'A morada deve conter pelo menos uma letra.'
      });
    }

    if (!/^\d{9}$/.test(nif)) {
      return res.render('register', {
        error: 'O NIF deve conter exatamente 9 dígitos.'
      });
    }

    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    if (isNaN(dataNasc.getTime()) || dataNasc > hoje) {
      return res.render('register', {
        error: 'A data de nascimento não pode ser no futuro.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'cliente',
      nomeCompleto,
      email,
      morada,
      telefone,
      dataNascimento: dataNasc,
      nif
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Erro no registo da conta.' });
  }
};

// LOGOUT
exports.logout = (req, res) => {
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

// RENDER DASHBOARD
exports.getDashboard = (req, res) => {
  res.render('dashboard', { error: null });
};

// PERFIL
exports.getProfile = (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');
  const successMessage = req.session.successMessage || null;
  req.session.successMessage = null;
  res.render('profile', { user, successMessage });
};

// EDIT PROFILE (GET)
exports.getEditProfile = (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');
  res.render('editProfile', { user, error: null, successMessage: null });
};

// EDIT PROFILE (POST)
exports.postEditProfile = async (req, res) => {
  const userId = req.session.user._id;
  const {
    nomeCompleto,
    email,
    morada,
    telefone,
    dataNascimento,
    nif
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Utilizador não encontrado');

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nomeCompleto)) {
      return res.render('editProfile', {
        user,
        successMessage: null,
        error: 'O nome completo não pode conter números ou caracteres especiais.'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.render('editProfile', {
        user,
        successMessage: null,
        error: 'O email introduzido não é válido.'
      });
    }

    if (!/^\d{9}$/.test(telefone)) {
      return res.render('editProfile', {
        user,
        successMessage: null,
        error: 'O número de telefone deve ter exatamente 9 dígitos.'
      });
    }

    if (!/[A-Za-z]/.test(morada)) {
      return res.render('editProfile', {
        user,
        successMessage: null,
        error: 'A morada deve conter letras.'
      });
    }

    if (!/^\d{9}$/.test(nif)) {
      return res.render('editProfile', {
        user,
        successMessage: null,
        error: 'O NIF deve conter exatamente 9 dígitos.'
      });
    }

    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    if (isNaN(dataNasc.getTime()) || dataNasc > hoje) {
      return res.render('editProfile', {
        user,
        successMessage: null,
        error: 'A data de nascimento não pode ser no futuro.'
      });
    }

    // Atualização dos dados
    user.nomeCompleto = nomeCompleto;
    user.email = email;
    user.morada = morada;
    user.telefone = telefone;
    user.dataNascimento = dataNasc;
    user.nif = nif;

    await user.save();
    req.session.user = user;
    req.session.successMessage = 'Perfil atualizado com sucesso!';
    res.redirect('/profile');

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar perfil');
  }
};
