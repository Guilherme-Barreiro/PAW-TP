const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const { verifyToken, isAdmin } = require('../controllers/authController');

router.use(verifyToken);
router.use(isAdmin);
router.get('/validar', restaurantController.listaValidacoes);
router.get('/dashboard', restaurantController.getAdminDashboard);
router.post('/validar/:id', restaurantController.validarRestaurante);
router.post('/recusar/:id', restaurantController.recusarRestaurante);

module.exports = router;