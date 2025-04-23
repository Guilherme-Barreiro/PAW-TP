const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const { verifyToken, isAdmin } = require('../controllers/authController');

// Acesso apenas a administradores
router.use(verifyToken);
router.use(isAdmin);

router.get('/validar', restaurantController.listaValidacoes);
router.post('/validar/:id', restaurantController.validarRestaurante);
router.post('/recusar/:id', restaurantController.recusarRestaurante);

module.exports = router;
