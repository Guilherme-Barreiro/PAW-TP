const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../controllers/authController');
const { verifyEmployeeToken } = require('../controllers/EmployeeController');

// Rotas públicas
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);

// Rotas protegidas (só podem ser acedidas através do login)
router.get('/profile', verifyToken, authController.getProfile);
router.get('/dashboard', verifyToken, authController.getDashboard);
router.get('/logout', authController.logout);
router.get('/profile/edit', verifyToken, authController.getEditProfile);
router.post('/profile/edit', verifyToken, authController.postEditProfile);

// Login e logout de funcionários
router.get('/employees/login', authController.getEmployeeLogin);
router.post('/employees/login', authController.postEmployeeLogin);
router.get('/employees/logout', authController.employeeLogout);
module.exports = router;
