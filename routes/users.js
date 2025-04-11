const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../controllers/authController');

router.get('/manage', verifyToken, userController.getManage);
router.post('/:id/delete', verifyToken, userController.postDelete);

module.exports = router;
