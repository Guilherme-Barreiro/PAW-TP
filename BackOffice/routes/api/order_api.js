const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/api/orderController_api');

/**
* @swagger
* /orders:
*   post:
*     summary: Criar novo pedido
*     tags: [Pedidos]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               restaurant:
*                 type: string
*                 description: ID do restaurante
*               items:
*                 type: array
*                 items:
*                   type: object
*                   properties:
*                     dish:
*                       type: string
*                       description: ID do prato
*                     quantity:
*                       type: integer
*                     tipo:
*                       type: string
*                       enum: [meia, inteira]
*     responses:
*       201:
*         description: Pedido criado com sucesso
*       400:
*         description: Dados inválidos
*       403:
*         description: Utilizador bloqueado
*       404:
*         description: Restaurante ou prato não encontrado
*       500:
*         description: Erro ao criar pedido
*/
// Criar novo pedido
router.post('/', orderController.create);

// Listar pedidos
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar pedidos do utilizador autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       500:
 *         description: Erro ao listar pedidos
 */
router.get('/', orderController.getAll);
/**
 * @swagger
 * /orders/restaurant/{id}:
 *   get:
 *     summary: Listar pedidos de um restaurante específico
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do restaurante
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada
 *       500:
 *         description: Erro ao buscar pedidos
 */
router.get('/byRestaurant/:id', orderController.getByRestaurant);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Cancelar um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso
 *       400:
 *         description: Cancelamento não permitido
 *       403:
 *         description: Sem permissão para cancelar
 *       404:
 *         description: Pedido ou utilizador não encontrado
 *       500:
 *         description: Erro ao cancelar pedido
 */
// ✅ Cancelar pedido (somente o cliente autenticado pode)
router.patch('/:id/cancel', orderController.cancelOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Atualizar o estado de um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, shipped, delivered]
 *     responses:
 *       200:
 *         description: Estado do pedido atualizado
 *       400:
 *         description: Estado inválido
 *       403:
 *         description: Sem permissão para atualizar
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao atualizar estado
 */
// Atualizar estado do pedido
router.patch('/:id/status', orderController.updateStatus);

module.exports = router;
