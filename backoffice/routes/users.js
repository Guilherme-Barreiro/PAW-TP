const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin, isOwner } = require('../controllers/authController');

// Rotas só para administradores
router.use(verifyToken);
router.use(isAdmin);

router.get('/manage', userController.getManage);
router.post('/:id/delete', userController.postDelete);

module.exports = router;