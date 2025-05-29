const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../../controllers/api/authController_api');

// ✅ importa a função diretamente do controller
const { verifyToken } = authController;

// ROTAS PARA CLIENTES
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e gestão de utilizadores
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de utilizador (cliente)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso
 *       401:
 *         description: Palavra-passe incorreta
 *       404:
 *         description: Utilizador não encontrado
 */
// POST /api/auth/login - Login de cliente
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registar novo utilizador (cliente)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - nomeCompleto
 *               - email
 *               - morada
 *               - telefone
 *               - dataNascimento
 *               - nif
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               nomeCompleto:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               morada:
 *                 type: string
 *               telefone:
 *                 type: string
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               nif:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilizador registado com sucesso
 *       400:
 *         description: Utilizador já existe
 */
// POST /api/auth/register - Registo de cliente
router.post('/register', authController.register);
/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obter perfil do utilizador autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do utilizador com restaurantes criados
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/profile', verifyToken, authController.getProfile);
/**
 * @swagger
 * /users/edit-profile:
 *   put:
 *     summary: Editar perfil do utilizador autenticado
 *     tags: [Utilizadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomeCompleto
 *               - email
 *               - morada
 *               - telefone
 *               - dataNascimento
 *               - nif
 *             properties:
 *               nomeCompleto:
 *                 type: string
 *               email:
 *                 type: string
 *               morada:
 *                 type: string
 *               telefone:
 *                 type: string
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               nif:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: NIF ou telefone já em uso
 *       404:
 *         description: Utilizador não encontrado
 *       500:
 *         description: Erro ao atualizar perfil
 */
router.put('/profile', verifyToken, authController.editProfile);
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Recuperar palavra-passe (esqueci-me da senha)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - novaSenha
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               novaSenha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Palavra-passe atualizada com sucesso
 *       404:
 *         description: Utilizador não encontrado
 */
// POST /api/auth/forgot-password - Recuperar palavra-passe
router.post('/forgot-password', authController.forgotPassword);

// ROTAS PARA FUNCIONÁRIOS
/**
 * @swagger
 * /auth/employee/login:
 *   post:
 *     summary: Login de funcionário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login de funcionário efetuado com sucesso
 *       401:
 *         description: Palavra-passe incorreta
 *       404:
 *         description: Funcionário não encontrado
 */
// POST /api/auth/employee/login - Login de funcionário
router.post('/employee/login', authController.employeeLogin);

// (Opcional: mais tarde podes criar um endpoint GET /employee/profile ou dashboard se precisares)

// EXPORTAR ROTAS
module.exports = router;
