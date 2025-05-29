const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/userController_api');

// Endpoints
/**
 * @swagger
 * tags:
 *   name: Utilizadores
 *   description: Gestão de utilizadores da aplicação
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os utilizadores
 *     tags: [Utilizadores]
 *     responses:
 *       200:
 *         description: Lista de utilizadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro ao carregar utilizadores
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina um utilizador pelo ID
 *     tags: [Utilizadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do utilizador
 *     responses:
 *       200:
 *         description: Utilizador eliminado com sucesso
 *       404:
 *         description: Utilizador não encontrado
 *       500:
 *         description: Erro ao apagar utilizador
 */
router.delete('/:id', userController.remove);

module.exports = router;
