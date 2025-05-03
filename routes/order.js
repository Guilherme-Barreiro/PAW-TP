const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/auth');

// Mostrar formulário de novo pedido
router.get('/create', isAuthenticated, orderController.showCreateForm);

// Criar pedido
router.post('/create', isAuthenticated, orderController.createOrder);

// Listar pedidos do funcionário
router.get('/', isAuthenticated, orderController.listOrders);

module.exports = router;
