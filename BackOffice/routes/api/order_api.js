const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/api/orderController_api');
const { isAuthenticatedAPI } = require('../../controllers/api/authController_api');//nao existe acho

// Criar novo pedido
router.post('/', orderController.create);

// Listar pedidos
router.get('/', orderController.getAll);

router.patch('/api/orders/:id/status', orderController.updateStatus);

module.exports = router;
