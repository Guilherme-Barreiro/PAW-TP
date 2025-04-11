const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../controllers/authController');

router.get('/manage', isAuthenticated, userController.getManage);
router.post('/:id/delete', isAuthenticated, userController.postDelete);

module.exports = router;
