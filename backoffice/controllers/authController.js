const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Employee = require('../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET;

// Este é um Middleware e verifica o token JWT nos cookies e liga o utilizador à request

exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/user/login');
  try {

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.redirect('/user/login');
    req.user = user;
    next();
  } catch (err) {
    console.error('Token inválido:', err);
    return res.redirect('/user/login');
  }
};


// Cria a página de login

exports.getLogin = (req, res) => {
  res.render('user/login', { 
    error: null, 
    showError: false, 
    title: 'Login' 
  });
};

// Valida as credenciais, cria a sessão e a sua respetiva token JWT

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

// Mostra a página de registo

exports.getRegister = (req, res) => {
  res.render('user/register', { error: null });
};

// Lê o registo de um novo utilizador
// Só prossegue caso os dados estejam todos corretos e validados de acordo com o tipo de dados

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
    if (isNaN(dataNasc.getTime()) || dataNasc.getFullYear() < 1910) {
      return res.render('user/register', {
        error: 'Hmmmmmm, estranho teres mais de 115 anos. Deveras duvidoso.'
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

// Esta função termina a sessão do utilizador e limpa as cookies redirecionando depois para a página principal

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao terminar sessão:', err);
      return res.status(500).send('Erro ao fazer logout');
    }

    res.clearCookie('token');       
    res.clearCookie('connect.sid');  

    req.session = null; 

    req.sessionSuccess = 'Sessão terminada com sucesso!';

    res.redirect('/');
  });
};


// Função que mostra o perfil associado ao utilizador que iniciou sessão

exports.getProfile = async (req, res) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return res.redirect('/user/login');

  try {
    const restaurantesCriados = await Restaurant.find({
      createdBy: sessionUser._id,
      status: { $in: ['pendente', 'validado'] }
    });
    ;

    const user = {
      ...sessionUser,
      restaurantesCriados
    };

    const successMessage = req.session.successMessage || null;
    req.session.successMessage = null;

    res.render('user/profile', { user, successMessage });
  } catch (err) {
    console.error('Erro ao buscar perfil e restaurantes:', err);
    res.status(500).send('Erro ao carregar perfil');
  }
};

// Esta função mostra a página para editar o perfil

exports.getEditProfile = (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/user/login');
  res.render('user/editProfile', { user, error: null, successMessage: null });
};

// Verifica os novos dados alterados pelo utilizador e atualiza caso esteja de acordo com o tipo de dados

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
    res.redirect('/user/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar perfil');
  }
};

// Esta função mostra a página de recuperação da palavra passe

exports.getForgotPassword = (req, res) => {
  res.render('user/forgotPassword', {
    title: 'Recuperar Senha',
    error: null,
    showForm: false,
    username: '',
    email: ''
  });
};

// Esta verifica se o utilizador introduziu corretamente o seu nome e email
// Procede depois para a nova password

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

// Esta função mostra o dashboard do admin

exports.getDashboard = (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
};

// Middleware para verificar se o utilizador está autenticado

exports.isAuthenticated = (req, res, next) => {
  if (req.session?.user) return next();
  return res.redirect('/user/login');
};

// Middleware para verificar se o utilizador é do tipo cliente
exports.isUser = (req, res, next) => {
  if (req.session?.user?.role === 'cliente') return next();
  return res.status(403).send('Acesso reservado a utilizadores.');
};

// Middleware para verificar se o utilizador criou um restaurante que está validado
exports.isRestaurant = async (req, res, next) => {
  try {
    const restaurante = await Restaurant.findOne({
      createdBy: req.session.user._id,
      validado: true,
      status: 'validado'
    });

    if (!restaurante) {
      return res.status(403).send('Acesso reservado a utilizadores com restaurante validado.');
    }

    next();
  } catch (err) {
    console.error('Erro ao verificar restaurante:', err);
    res.status(500).send('Erro interno ao verificar restaurante');
  }
};

// Middleware para verificar se o utilizador é do tipo admin
exports.isAdmin = (req, res, next) => {
  if (req.session?.user?.role === 'admin') return next();
  return res.status(403).send('Acesso reservado ao administrador.');
};

//funções para o funcionário
exports.getEmployeeLogin = (req, res) => {
  res.render('employee/login', {
    error: null,
    title: 'Login Funcionário'
  });
};

exports.postEmployeeLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const employee = await Employee.findOne({ username });
    if (!employee) {
      return res.render('employee/login', {
        error: 'Funcionário não encontrado.',
        title: 'Login Funcionário'
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.render('employee/login', {
        error: 'Palavra-passe incorreta.',
        title: 'Login Funcionário'
      });
    }

    const token = jwt.sign(
      { id: employee._id, role: 'employee' },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie('employeeToken', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000
    });

    req.session.employee = employee;
    res.redirect('/employees/dashboard');
  } catch (err) {
    console.error(err);
    res.render('employee/login', {
      error: 'Erro ao autenticar.',
      title: 'Login Funcionário'
    });
  }
};

exports.employeeLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao terminar sessão:', err);
      return res.status(500).send('Erro ao fazer logout');
    }

    res.clearCookie('employeeToken');
    res.redirect('/employees/login');
  });
};

exports.isOwner = async (req, res, next) => {
  console.log('[isOwner] user na sessão:', req.session.user); // <-- aqui

  try {
    const restaurantes = await Restaurant.find({
      createdBy: req.session.user._id
    });

    if (restaurantes.length > 0) {
      console.log('[isOwner] Acesso permitido');
      return next();
    }

    console.log('[isOwner] Sem restaurantes encontrados');
    return res.status(403).send('Acesso reservado a donos de restaurante.');
  } catch (err) {
    console.error('Erro no middleware isOwner:', err);
    return res.status(500).send('Erro ao verificar permissões.');
  }
};
