const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../controllers/authController');

router.use(verifyToken);

// Rotas protegidas, só acedidas através de login

router.get('/manage', userController.getManage);
router.post('/:id/delete', userController.postDelete);

module.exports = router;
