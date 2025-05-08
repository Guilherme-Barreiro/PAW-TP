// controllers/employeeController.js
const Restaurant = require('../models/Restaurant');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_fallback';

// Criar funcionário
exports.createEmployee = async (req, res) => {
  try {
    const {
      username,
      password,
      nomeCompleto,
      email,
      telefone,
      restaurants
    } = req.body;

    const existing = await Employee.findOne({ username });
    if (existing) {
      return res.status(400).send('Já existe um funcionário com esse username.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      username,
      password: hashedPassword,
      nomeCompleto,
      email,
      telefone,
      restaurants: Array.isArray(restaurants) ? restaurants : [restaurants],
      owner: req.session.user._id
    });

    await newEmployee.save();

    res.redirect('/employee/listEmployee');
  } catch (err) {
    console.error('Erro ao criar funcionário:', err);
    res.status(500).send('Erro ao criar funcionário.');
  }
};

// Obter todos os funcionários do dono autenticado
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ owner: req.user._id }).populate('restaurants');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar funcionário
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    delete update.owner;
    delete update.password;

    const employee = await Employee.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      update,
      { new: true }
    );

    if (!employee) return res.status(404).json({ error: 'Funcionário não encontrado.' });

    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remover funcionário
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Employee.findOneAndDelete({ _id: id, owner: req.user._id });

    if (!deleted) return res.status(404).json({ error: 'Funcionário não encontrado.' });

    res.redirect('/employee/listEmployee');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyEmployeeToken = async (req, res, next) => {
  const token = req.cookies.employeeToken;

  if (!token) return res.redirect('/auth/employee/login');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const employee = await Employee.findById(decoded.id).populate('restaurants');

    if (!employee) return res.redirect('/auth/employee/login');

    req.employee = employee;
    next();
  } catch (err) {
    console.error('Token inválido (funcionário):', err);
    return res.redirect('/auth/employee/login');
  }
};

exports.getEditEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      owner: req.session.user._id
    }).populate('restaurants');

    const restaurantesCriados = await Restaurant.find({
      createdBy: req.session.user._id
    });

    if (!employee) return res.status(404).send('Funcionário não encontrado.');

    res.render('employee/editEmployee', {
      employee,
      restaurantesCriados
    });
  } catch (err) {
    console.error('Erro ao carregar funcionário para edição:', err);
    res.status(500).send('Erro interno');
  }
};

exports.postEditEmployee = async (req, res) => {
  try {
    const { username, nomeCompleto, email, telefone, restaurants } = req.body;

    await Employee.findOneAndUpdate(
      { _id: req.params.id, owner: req.session.user._id },
      {
        username,
        nomeCompleto,
        email,
        telefone,
        restaurants: Array.isArray(restaurants) ? restaurants : [restaurants]
      }
    );

    res.redirect('/employee/listEmployee');
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    res.status(500).send('Erro ao atualizar funcionário.');
  }
};

exports.renderEmployeeList = async (req, res) => {
  try {
    const employees = await Employee.find({ owner: req.session.user._id }).populate('restaurants');

    res.render('employee/listEmployee', { funcionarios: employees });
  } catch (err) {
    console.error('Erro ao renderizar lista de funcionários:', err);
    res.status(500).send('Erro ao carregar a lista.');
  }
};

exports.getNewFuncionario = async (req, res) => {
  try {
    const restaurantesCriados = await Restaurant.find({
      createdBy: req.session.user._id
    });

    res.render('employee/createEmployee', { restaurantesCriados });
  } catch (err) {
    console.error('Erro ao carregar formulário de funcionário:', err);
    res.status(500).send('Erro ao carregar o formulário.');
  }
};
