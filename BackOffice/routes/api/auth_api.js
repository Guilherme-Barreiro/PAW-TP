const express = require('express');
const router = express.Router();
const authController = require('../../controllers/api/authController_api');

// ROTAS PARA CLIENTES

// POST /api/auth/login - Login de cliente
router.post('/login', authController.login);

// POST /api/auth/register - Registo de cliente
router.post('/register', authController.register);

// GET /api/auth/profile - Perfil do utilizador autenticado
router.get('/profile', authController.getProfile);

// PUT /api/auth/profile - Editar perfil do utilizador autenticado
router.put('/profile', authController.editProfile);

// POST /api/auth/forgot-password - Recuperar palavra-passe
router.post('/forgot-password', authController.forgotPassword);

// ROTAS PARA FUNCIONÁRIOS

// POST /api/auth/employee/login - Login de funcionário
router.post('/employee/login', authController.employeeLogin);

// (Opcional: mais tarde podes criar um endpoint GET /employee/profile ou dashboard se precisares)

// EXPORTAR ROTAS
module.exports = router;
