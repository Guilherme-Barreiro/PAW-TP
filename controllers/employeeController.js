// controllers/employee.api.controller.js
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_fallback';

// Criar funcionário
exports.createEmployee = async (req, res) => {
  try {
    const { username, password, nomeCompleto, email, telefone, restaurants } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      username,
      password: hashedPassword,
      nomeCompleto,
      email,
      telefone,
      owner: req.user._id,
      restaurants
    });

    await employee.save();
    res.status(201).json({ message: 'Funcionário criado com sucesso.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

    res.json({ message: 'Funcionário removido com sucesso.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyEmployeeToken = async (req, res, next) => {
  const token = req.cookies.employeeToken;

  if (!token) return res.redirect('/auth/employees/login');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const employee = await Employee.findById(decoded.id).populate('restaurants');

    if (!employee) return res.redirect('/auth/employees/login');

    req.employee = employee;
    next();
  } catch (err) {
    console.error('Token inválido (funcionário):', err);
    return res.redirect('/auth/employees/login');
  }
};