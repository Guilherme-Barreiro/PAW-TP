const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/api/orderController_api');

// Criar novo pedido
router.post('/', orderController.create);

// Listar pedidos
router.get('/', orderController.getAll);

module.exports = router;
