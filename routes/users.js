const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../controllers/authController');

// 🔐 Só acessível se estiver logado
router.use(verifyToken);

router.get('/manage', userController.getManage);
router.post('/:id/delete', userController.postDelete);

module.exports = router;
