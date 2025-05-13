const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/restaurantController_api');
const upload = require('../../utils/multerConfig'); // ou o correto path para imagens dos pratos

// CRUD de restaurantes
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

// Menu do restaurante
router.get('/:id/menu', controller.getMenu);
router.post('/:id/menu', controller.addDish);
router.put('/:id/menu/:index', controller.updateDish);
router.delete('/:id/menu/:index', controller.removeDish);
router.get('/:id/menu/:index', controller.getDishByIndex);

// Upload de imagem de prato
router.post('/:id/menu/:index/image', upload.single('image'), controller.uploadDishImage);

// Filtros de pesquisa
router.get('/filter/search', controller.filterRestaurants);

// Validação de restaurante
router.put('/:id/validate', controller.validateRestaurant);
router.put('/:id/reject', controller.rejectRestaurant);

// Listagens adicionais
router.get('/owner/:ownerId', controller.getByOwner);
router.get('/status/pending', controller.getPending);
router.get('/status/validated', controller.getValidated);

// Dashboard de admin
router.get('/admin/dashboard', controller.adminDashboard);

module.exports = router;
