const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/employeeController_api');
const { verifyToken } = require('../../controllers/api/authController_api');

router.use(verifyToken); // todas as rotas requerem token JWT do owner
/**
 * @swagger
 * tags:
 *   name: Funcionários
 *   description: Gestão de funcionários dos restaurantes
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Listar todos os funcionários do utilizador autenticado
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Erro ao listar funcionários
 */
router.get('/', controller.getAll);
/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Criar novo funcionário
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
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
 *               - telefone
 *               - restaurants
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               nomeCompleto:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               restaurants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso
 *       400:
 *         description: Username já existe
 *       500:
 *         description: Erro ao criar funcionário
 */
router.post('/', controller.create);
/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Atualizar um funcionário
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do funcionário
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeCompleto:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               restaurants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Funcionário atualizado com sucesso
 *       404:
 *         description: Funcionário não encontrado
 *       400:
 *         description: Erro ao atualizar funcionário
 */
router.put('/:id', controller.update);
/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Apagar um funcionário
 *     tags: [Funcionários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do funcionário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Funcionário removido com sucesso
 *       404:
 *         description: Funcionário não encontrado
 *       400:
 *         description: Erro ao apagar funcionário
 */

router.delete('/:id', controller.remove);

module.exports = router;
