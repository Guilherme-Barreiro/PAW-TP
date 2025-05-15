    const express = require('express');
    const router = express.Router();
    const jwt = require('jsonwebtoken');
    const authController = require('../../controllers/api/authController_api');

    // ✅ importa a função diretamente do controller
    const { verifyToken } = authController;

    // ROTAS PARA CLIENTES

    // POST /api/auth/login - Login de cliente
    router.post('/login', authController.login);

    // POST /api/auth/register - Registo de cliente
    router.post('/register', authController.register);

    router.get('/profile', verifyToken, authController.getProfile);
    router.put('/profile', verifyToken, authController.editProfile);

    // POST /api/auth/forgot-password - Recuperar palavra-passe
    router.post('/forgot-password', authController.forgotPassword);

    // ROTAS PARA FUNCIONÁRIOS

    // POST /api/auth/employee/login - Login de funcionário
    router.post('/employee/login', authController.employeeLogin);

    // (Opcional: mais tarde podes criar um endpoint GET /employee/profile ou dashboard se precisares)

    // EXPORTAR ROTAS
    module.exports = router;
