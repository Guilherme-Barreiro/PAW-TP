// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || user.password !== password) { // ideal: usar bcrypt
    return res.render('login', { error: 'Credenciais inválidas.' });
  }

  // Guardar info em sessão (precisas do express-session)
  req.session.user = { id: user._id, username: user.username, role: user.role };
  res.redirect('/'); // ou dashboard específico por role
});

module.exports = router;
