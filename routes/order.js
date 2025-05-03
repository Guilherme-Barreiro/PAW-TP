const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, orderController.listOrders);
router.post('/create', isAuthenticated, orderController.createOrder);

module.exports = router;
