const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/api/commentController_api');
const multer = require('multer');
const upload = multer({ dest: 'public/images/comments/' });
const { verifyToken } = require('../../controllers/api/authController'); // se usares JWT

/**
 * @swagger
 * /api/orders/{id}/comments:
 *   post:
 *     summary: Adiciona um comentário a uma encomenda entregue
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da encomenda
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Excelente serviço!"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comentário adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       403:
 *         description: Apenas encomendas entregues podem ser comentadas
 *       500:
 *         description: Erro ao guardar o comentário
 */
// POST /api/comments/:id
router.post('/:id', verifyToken, upload.single('image'), commentController.addComment);

/**
 * @swagger
 * /api/orders/{id}/comments:
 *   get:
 *     summary: Obtém os comentários de uma encomenda
 *     tags: [Pedidos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da encomenda
 *     responses:
 *       200:
 *         description: Lista de comentários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Erro ao buscar comentários
 */
// GET /api/comments/:id
router.get('/:id', commentController.getCommentsByOrder);

module.exports = router;
