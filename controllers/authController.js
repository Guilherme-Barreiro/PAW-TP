const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware: Verifica token da sessão
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect('/user/login');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token inválido:', err);
    return res.redirect('/user/login');
  }
};

// RENDER LOGIN
exports.getLogin = (req, res) => {
  res.render('user/login', { error: null, showError: false, title: 'Login' });
};

// AUTENTICAÇÃO
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('user/login', {
        error: 'Utilizador não encontrado.',
        showError: true,
        title: 'Login'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('user/login', {
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
    res.render('user/login', {
      error: 'Erro ao autenticar.',
      showError: true,
      title: 'Login'
    });
  }
};

// RENDER REGISTO
exports.getRegister = (req, res) => {
  res.render('user/register', { error: null });
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
    const userExists = await User.findOne({
      $or: [
        { username },
        { email },
        { nif },
        { telefone }
      ]
    });
    
    if (userExists) {
      return res.render('user/register', {
        error: 'Já existe um utilizador com este nome de utilizador, email, NIF ou telefone.',
      });
    }    

    if (!/^[A-Za-z]+$/.test(username)) {
      return res.render('user/register', {
        error: 'O nome de utilizador só pode conter letras (sem espaços, números ou símbolos).'
      });
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nomeCompleto)) {
      return res.render('user/register', {
        error: 'O nome completo não pode conter números ou caracteres especiais.'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.render('user/register', { error: 'O email introduzido não é válido.' });
    }

    if (!/^\d{9}$/.test(telefone)) {
      return res.render('user/register', {
        error: 'O número de telefone deve ter exatamente 9 dígitos.'
      });
    }

    if (!/[A-Za-z]/.test(morada)) {
      return res.render('user/register', {
        error: 'A morada deve conter pelo menos uma letra.'
      });
    }

    if (!/^\d{9}$/.test(nif)) {
      return res.render('user/register', {
        error: 'O NIF deve conter exatamente 9 dígitos.'
      });
    }

    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    if (isNaN(dataNasc.getTime()) || dataNasc > hoje) {
      return res.render('user/register', {
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
    res.redirect('/user/login');
  } catch (err) {
    console.error(err);
    res.render('user/register', { error: 'Erro no registo da conta.' });
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
    res.redirect('/user/login');
  });
};

// PERFIL
exports.getProfile = (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/user/login');
  const successMessage = req.session.successMessage || null;
  req.session.successMessage = null;
  res.render('user/profile', { user, successMessage });
};

// EDIT PROFILE (GET)
exports.getEditProfile = (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/user/login');
  res.render('user/editProfile', { user, error: null, successMessage: null });
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
      return res.render('user/editProfile', {
        user,
        successMessage: null,
        error: 'O nome completo não pode conter números ou caracteres especiais.'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.render('user/editProfile', {
        user,
        successMessage: null,
        error: 'O email introduzido não é válido.'
      });
    }

    if (!/^\d{9}$/.test(telefone)) {
      return res.render('user/editProfile', {
        user,
        successMessage: null,
        error: 'O número de telefone deve ter exatamente 9 dígitos.'
      });
    }

    if (!/[A-Za-z]/.test(morada)) {
      return res.render('user/editProfile', {
        user,
        successMessage: null,
        error: 'A morada deve conter letras.'
      });
    }

    if (!/^\d{9}$/.test(nif)) {
      return res.render('user/editProfile', {
        user,
        successMessage: null,
        error: 'O NIF deve conter exatamente 9 dígitos.'
      });
    }

    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    if (isNaN(dataNasc.getTime()) || dataNasc > hoje) {
      return res.render('user/editProfile', {
        user,
        successMessage: null,
        error: 'A data de nascimento não pode ser no futuro.'
      });
    }

    user.nomeCompleto = nomeCompleto;
    user.email = email;
    user.morada = morada;
    user.telefone = telefone;
    user.dataNascimento = dataNasc;
    user.nif = nif;

    await user.save();
    req.session.user = user;
    req.session.successMessage = 'Perfil atualizado com sucesso!';
    res.redirect('/user/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar perfil');
  }
};

exports.getForgotPassword = (req, res) => {
  res.render('user/forgotPassword', {
    title: 'Recuperar Senha',
    error: null,
    showForm: false,
    username: '',
    email: ''
  });
};

exports.postForgotPassword = async (req, res) => {
  const { username, email, novaSenha, confirmarSenha } = req.body;

  try {
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.render('user/forgotPassword', {
        title: 'Recuperar Senha',
        error: 'Utilizador não encontrado com esses dados.',
        showForm: false,
        username,
        email
      });
    }

    if (!novaSenha || !confirmarSenha) {
      // Se está na primeira parte do processo, só com username/email
      return res.render('user/forgotPassword', {
        title: 'Recuperar Senha',
        showForm: true,
        error: null,
        username,
        email
      });
    }

    if (novaSenha !== confirmarSenha) {
      return res.render('user/forgotPassword', {
        title: 'Recuperar Senha',
        error: 'As palavras-passe não coincidem.',
        showForm: true,
        username,
        email
      });
    }

    const hashed = await bcrypt.hash(novaSenha, 10);
    user.password = hashed;
    await user.save();

    res.redirect('/user/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar a senha');
  }
};


// RENDER DASHBOARD
exports.getDashboard = (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
};



