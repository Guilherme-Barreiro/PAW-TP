const Employee = require('../../models/Employee');
const Restaurant = require('../../models/Restaurant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_fallback';

// Criar funcionário
exports.create = async (req, res) => {
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
    if (existing) return res.status(400).json({ error: 'Username já existe.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      username,
      password: hashedPassword,
      nomeCompleto,
      email,
      telefone,
      restaurants: Array.isArray(restaurants) ? restaurants : [restaurants],
      owner: req.user.id
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Funcionário criado com sucesso.', employee: newEmployee });
  } catch (err) {
    console.error('Erro ao criar funcionário:', err);
    res.status(500).json({ error: 'Erro ao criar funcionário.' });
  }
};

// Listar funcionários do owner
exports.getAll = async (req, res) => {
  try {
    const employees = await Employee.find({ owner: req.user.id }).populate('restaurants');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar funcionários.' });
  }
};

// Atualizar funcionário
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    delete update.owner;
    delete update.password;

    const employee = await Employee.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      update,
      { new: true }
    );

    if (!employee) return res.status(404).json({ error: 'Funcionário não encontrado.' });

    res.json({ message: 'Funcionário atualizado com sucesso.', employee });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar funcionário.' });
  }
};

// Apagar funcionário
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Employee.findOneAndDelete({ _id: id, owner: req.user.id });

    if (!deleted) return res.status(404).json({ error: 'Funcionário não encontrado.' });

    res.json({ message: 'Funcionário removido com sucesso.' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao apagar funcionário.' });
  }
};
