const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const uploadPrato = require('../utils/multerConfig'); 
const uploadRestaurants = require('../utils/multerConfigRestaurants');
const { verifyToken, isUser, isAdmin } = require('../controllers/authController');

// Rotas Públicas
router.get('/list', restaurantController.getList);
router.get('/search', restaurantController.getFilteredList);
router.get('/:id/menu', restaurantController.viewMenu);
router.get('/:id/menu/:pratoIndex', restaurantController.viewPrato);

// Apenas utilizadores que estejam autenticados podem fazer pedido para registar o restaurante que pretendem
router.get('/register', verifyToken, isUser, restaurantController.getRegister);
router.post('/register', verifyToken, isUser, uploadRestaurants.single('image'), restaurantController.postRegister);

// Verifica se está autenticado
router.use(verifyToken);

// Só o dono do restaurante pode gerir o mesmo 
router.get('/:id/manage', restaurantController.getManage);
router.get('/:id/add-menu', restaurantController.getAddMenu);
router.post('/:id/add-menu', uploadPrato.single('image'), restaurantController.postAddMenu);
router.get('/:id/edit-menu/:pratoIndex', restaurantController.getEditMenu);
router.post('/:id/edit-menu/:pratoIndex', uploadPrato.single('image'), restaurantController.postEditMenu);
router.post('/:id/remove-menu/:pratoIndex', restaurantController.postRemoveMenu);
router.get('/:id/edit', restaurantController.getEditRestaurant);
router.post('/:id/edit', uploadRestaurants.single('image'), restaurantController.postEditRestaurant);
router.post('/:id/delete', restaurantController.postDeleteRestaurant);

// Apenas o admin pode validar restaurantes
router.post('/:id/validate', isAdmin, restaurantController.validateRestaurant);

module.exports = router;
