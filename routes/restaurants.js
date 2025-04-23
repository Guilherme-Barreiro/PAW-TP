// routes/restaurants.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const upload = require('../utils/multerConfig');
const { verifyToken, isUser, isAdmin } = require('../controllers/authController');

// 🔓 Acesso público
router.get('/list', restaurantController.getList);
router.get('/search', restaurantController.getFilteredList);
router.get('/:id/menu', restaurantController.viewMenu);
router.get('/:id/menu/:pratoIndex', restaurantController.viewPrato);

// 🔓 Acesso ao registo (apenas utilizadores autenticados)
router.get('/register', verifyToken, isUser, restaurantController.getRegister);
router.post('/register', verifyToken, isUser, restaurantController.postRegister);

// 🔒 A partir daqui, autenticado obrigatório
router.use(verifyToken);

// 🔒 Apenas o dono do restaurante pode gerir (validação feita no controller)
router.get('/:id/manage', restaurantController.getManage);
router.get('/:id/add-menu', restaurantController.getAddMenu);
router.post('/:id/add-menu', upload.single('image'), restaurantController.postAddMenu);
router.get('/:id/edit-menu/:pratoIndex', restaurantController.getEditMenu);
router.post('/:id/edit-menu/:pratoIndex', upload.single('image'), restaurantController.postEditMenu);
router.post('/:id/remove-menu/:pratoIndex', restaurantController.postRemoveMenu);
router.get('/:id/edit', restaurantController.getEditRestaurant);
router.post('/:id/edit', restaurantController.postEditRestaurant);
router.post('/:id/delete', restaurantController.postDeleteRestaurant);

// 🔒 Apenas admin pode validar restaurante
router.post('/:id/validate', isAdmin, restaurantController.validateRestaurant);


module.exports = router;