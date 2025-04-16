const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../controllers/authController');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Rotas protegidas, só acedidas através de login
router.get('/profile', verifyToken, authController.getProfile);
router.get('/dashboard', verifyToken, authController.getDashboard);
router.get('/logout', authController.logout);
router.get('/profile/edit', verifyToken, authController.getEditProfile);
router.post('/profile/edit', verifyToken, authController.postEditProfile);

module.exports = router;
