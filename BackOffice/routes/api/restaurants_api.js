const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/restaurantController_api');
const upload = require('../../utils/multerConfig');
const uploadRestaurant = require('../../utils/multerConfigRestaurants');
/**
 * @swagger
 * tags:
 *   name: Restaurantes
 *   description: Endpoints para gestão de restaurantes e seus menus
 */
// ✅ Primeiras: rotas fixas e específicas
/**
 * @swagger
 * /restaurants/public:
 *   get:
 *     summary: Lista de restaurantes públicos validados
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: Lista de restaurantes públicos
 */
router.get('/public', controller.getPublicRestaurants);
/**
 * @swagger
 * /restaurants/filter:
 *   get:
 *     summary: Filtrar restaurantes
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do restaurante
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         description: Preço máximo
 *     responses:
 *       200:
 *         description: Lista de restaurantes filtrados
 */
router.get('/filter/search', controller.filterRestaurants);
/**
 * @swagger
 * /restaurants/{id}/validate:
 *   put:
 *     summary: Validar restaurante
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurante validado
 *       404:
 *         description: Restaurante não encontrado
 */
router.put('/:id/validate', controller.validateRestaurant);
/**
 * @swagger
 * /restaurants/{id}/reject:
 *   put:
 *     summary: Rejeitar um restaurante
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do restaurante
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurante rejeitado com sucesso
 *       404:
 *         description: Restaurante não encontrado
 *       500:
 *         description: Erro ao recusar restaurante
 */
router.put('/:id/reject', controller.rejectRestaurant);
/**
 * @swagger
 * /restaurants/owner/{ownerId}:
 *   get:
 *     summary: Obter todos os restaurantes de um dono específico
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: ID do dono
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de restaurantes retornada com sucesso
 *       500:
 *         description: Erro ao buscar restaurantes do utilizador
 */
router.get('/owner/:ownerId', controller.getByOwner);
/**
 * @swagger
 * /restaurants/pending:
 *   get:
 *     summary: Listar todos os restaurantes pendentes
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: Restaurantes pendentes retornados com sucesso
 *       500:
 *         description: Erro ao buscar restaurantes pendentes
 */
router.get('/status/pending', controller.getPending);
/**
 * @swagger
 * /restaurants/validated:
 *   get:
 *     summary: Listar todos os restaurantes validados
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: Restaurantes validados retornados com sucesso
 *       500:
 *         description: Erro ao buscar restaurantes validados
 */
router.get('/status/validated', controller.getValidated);
/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Obter estatísticas do dashboard administrativo
 *     tags: [Administração]
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRestaurants:
 *                       type: integer
 *                     totalDishes:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *       500:
 *         description: Erro ao carregar dashboard
 */
router.get('/admin/dashboard', controller.adminDashboard);
/**
 * @swagger
 * /restaurants/dish/{id}:
 *   get:
 *     summary: Obter detalhes de um prato pelo seu ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do prato
 *     responses:
 *       200:
 *         description: Prato retornado com sucesso
 *       404:
 *         description: Restaurante ou prato não encontrado
 *       500:
 *         description: Erro ao buscar prato
 */
router.get('/dish/:id', controller.getDishById);
/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Criar novo restaurante
 *     tags: [Restaurantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               tempoPreparacao:
 *                 type: number
 *               tempoEntrega:
 *                 type: number
 *               raioEntrega:
 *                 type: number
 *     responses:
 *       201:
 *         description: Restaurante criado
 *       400:
 *         description: Erro ao criar
 */
router.post('/', uploadRestaurant.single('image'), controller.create);
// ✅ Depois: rotas com parâmetros dinâmicos
/**
 * @swagger
 * /restaurants/{id}/menu:
 *   get:
 *     summary: Obtém o menu de um restaurante
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do restaurante
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu do restaurante
 *       404:
 *         description: Restaurante não encontrado
 */
router.get('/:id/menu', controller.getMenu);
/**
 * @swagger
 * /restaurants/{id}/menu:
 *   post:
 *     summary: Adiciona um prato ao menu
 *     tags: [Restaurantes]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do restaurante
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - tempoPreparacao
 *               - price_meia
 *               - price_inteira
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               nutrition:
 *                 type: string
 *               tempoPreparacao:
 *                 type: number
 *               price_meia:
 *                 type: number
 *               price_inteira:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Prato adicionado
 *       400:
 *         description: Menu já tem 10 pratos ou dados inválidos
 */
router.post('/:id/menu', upload.single('image'), controller.addDish);
/**
 * @swagger
 * /restaurants/{id}/menu/{index}:
 *   put:
 *     summary: Atualiza um prato do menu
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Prato atualizado
 *       404:
 *         description: Restaurante ou prato não encontrado
 */
router.put('/:id/menu/:index', controller.updateDish);
/**
 * @swagger
 * /restaurants/{id}/menu/{index}:
 *   delete:
 *     summary: Remove um prato do menu
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prato removido
 *       404:
 *         description: Restaurante ou prato não encontrado
 */
router.delete('/:id/menu/:index', controller.removeDish);
/**
 * @swagger
 * /restaurants/{id}/menu/{index}:
 *   get:
 *     summary: Obter prato do menu por índice
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do restaurante
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *         description: Índice do prato no menu
 *     responses:
 *       200:
 *         description: Prato retornado com sucesso
 *       404:
 *         description: Restaurante ou prato não encontrado
 *       500:
 *         description: Erro ao buscar prato
 */
router.get('/:id/menu/:index', controller.getDishByIndex);
/**
 * @swagger
 * /restaurants/{id}/menu/{index}/image:
 *   post:
 *     summary: Upload da imagem de um prato específico
 *     tags: [Restaurantes]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do restaurante
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *         description: Índice do prato no menu
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Ficheiro de imagem a carregar
 *     responses:
 *       200:
 *         description: Imagem atualizada com sucesso
 *       400:
 *         description: Nenhum ficheiro enviado
 *       404:
 *         description: Restaurante ou prato não encontrado
 *       500:
 *         description: Erro ao atualizar imagem
 */
router.post('/:id/menu/:index/image', upload.single('image'), controller.uploadDishImage);
/**
 * @swagger
 * /restaurants/{id}/menu/{index}/image:
 *   post:
 *     summary: Fazer upload de imagem para um prato do menu
 *     tags: [Restaurantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do restaurante
 *         schema:
 *           type: string
 *       - in: path
 *         name: index
 *         required: true
 *         description: Índice do prato no menu
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem atualizada com sucesso
 *       400:
 *         description: Nenhum ficheiro enviado
 *       404:
 *         description: Prato ou restaurante não encontrado
 *       500:
 *         description: Erro ao atualizar imagem do prato
 */
router.put('/:id', uploadRestaurant.single('image'), controller.updateWithImage);
/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Buscar restaurante por ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do restaurante
 *     responses:
 *       200:
 *         description: Restaurante encontrado
 *       404:
 *         description: Restaurante não encontrado
 */
router.get('/:id', controller.getOne);
/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Remover restaurante
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurante removido com sucesso
 *       404:
 *         description: Restaurante não encontrado
 */
router.delete('/:id', controller.remove);

module.exports = router;
