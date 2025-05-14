const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/api/orderController_api');

// Criar novo pedido (apenas para empregados autenticados)
router.post('/', orderController.createOrder);

// Listar pedidos do funcionário
router.get('/', orderController.listOrders);

module.exports = router;
