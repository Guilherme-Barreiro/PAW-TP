const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../controllers/authController');

router.get('/profile', verifyToken, authController.getProfile);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);
router.get('/dashboard', verifyToken, authController.getDashboard);

module.exports = router;
