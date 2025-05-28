const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/api/orderController_api');

// Criar novo pedido
router.post('/', orderController.create);

// Listar pedidos
router.get('/', orderController.getAll);
router.get('/byRestaurant/:id', orderController.getByRestaurant);


// ✅ Cancelar pedido (somente o cliente autenticado pode)
router.patch('/:id/cancel', orderController.cancelOrder);

// Atualizar estado do pedido
router.patch('/:id/status', orderController.updateStatus);

module.exports = router;
