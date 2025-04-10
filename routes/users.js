const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET - Página de gestão de utilizadores
router.get('/manage', async (req, res) => {
  try {
    const users = await User.find();
    res.render('userManage', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar utilizadores');
  }
});

// POST - Eliminar utilizador
router.post('/:id/delete', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users/manage');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao apagar utilizador');
  }
});

module.exports = router;
