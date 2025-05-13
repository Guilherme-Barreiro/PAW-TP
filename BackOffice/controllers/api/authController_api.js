const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Restaurant = require('../../models/Restaurant');
const Employee = require('../../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET;

// Login de utilizador (cliente)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Palavra-passe incorreta.' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Login efetuado com sucesso', token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao autenticar.' });
  }
};

// Registo
exports.register = async (req, res) => {
  const { username, password, nomeCompleto, email, morada, telefone, dataNascimento, nif } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { telefone }, { nif }]
    });
    if (existingUser) return res.status(400).json({ error: 'Utilizador já existe.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      nomeCompleto,
      email,
      morada,
      telefone,
      dataNascimento: new Date(dataNascimento),
      nif,
      role: 'cliente'
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilizador registado com sucesso', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registar utilizador.' });
  }
};

// Perfil do utilizador
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const restaurantes = await Restaurant.find({ createdBy: req.user.id, status: { $in: ['pendente', 'validado'] } });
    res.json({ user, restaurantes });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
};

// Editar perfil
exports.editProfile = async (req, res) => {
  const { nomeCompleto, email, morada, telefone, dataNascimento, nif } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    user.nomeCompleto = nomeCompleto;
    user.email = email;
    user.morada = morada;
    user.telefone = telefone;
    user.dataNascimento = new Date(dataNascimento);
    user.nif = nif;

    await user.save();
    res.json({ message: 'Perfil atualizado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
};

// Esquecer palavra-passe (recuperação)
exports.forgotPassword = async (req, res) => {
  const { username, email, novaSenha } = req.body;

  try {
    const user = await User.findOne({ username, email });
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    const hashed = await bcrypt.hash(novaSenha, 10);
    user.password = hashed;
    await user.save();
    res.json({ message: 'Palavra-passe atualizada com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar senha.' });
  }
};

// Login de funcionário
exports.employeeLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const employee = await Employee.findOne({ username });
    if (!employee) return res.status(404).json({ error: 'Funcionário não encontrado.' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(401).json({ error: 'Palavra-passe incorreta.' });

    const token = jwt.sign({ id: employee._id, role: 'employee' }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Login funcionário com sucesso', token, employee });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao autenticar funcionário.' });
  }
};
