// routes/admin.js
const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const authController = require('../controllers/authController');

// Garante que o utilizador está autenticado E é admin
router.use(authController.verifyToken);
router.use(authController.isAdmin);

// Listar restaurantes por validar
router.get('/validar', restaurantController.listaValidacoes);

// Validar restaurante (POST)
router.post('/validar/:id', restaurantController.validarRestaurante);

module.exports = router;
