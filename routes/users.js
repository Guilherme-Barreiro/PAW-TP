const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../controllers/authController');

router.use(verifyToken);
router.use(isAdmin); // Protege todas as rotas abaixo

router.get('/manage', userController.getManage);
router.post('/:id/delete', userController.postDelete);

module.exports = router;
