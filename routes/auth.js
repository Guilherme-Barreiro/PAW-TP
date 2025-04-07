const express = require('express');
const router = express.Router();

// Rota de login (GET)
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

module.exports = router;
