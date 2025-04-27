const express = require('express');
const router = express.Router();

// Dá import aos controllers necessários
const restaurantController = require('../controllers/restaurantController');
const { verifyToken, isAdmin } = require('../controllers/authController');

// Middleware para verificar se o utilizador está com a sessão ativa
router.use(verifyToken);

// Middleware para garantir que o utilizador é do tipo admin
router.use(isAdmin);

// Rota para listar os restaurantes pendentes
router.get('/validar', restaurantController.listaValidacoes);

// Rota para redirecionar ao dashboard de administração
router.get('/dashboard', restaurantController.getAdminDashboard);

// Rota para validar um restaurante específico
router.post('/validar/:id', restaurantController.validarRestaurante);

// Rota para recusar um restaurante específico
router.post('/recusar/:id', restaurantController.recusarRestaurante);

module.exports = router;
