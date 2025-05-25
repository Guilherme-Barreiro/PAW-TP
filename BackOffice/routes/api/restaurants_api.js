const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/restaurantController_api');
const upload = require('../../utils/multerConfig');
const uploadRestaurant = require('../../utils/multerConfigRestaurants');

// ✅ Primeiras: rotas fixas e específicas
router.get('/public', controller.getPublicRestaurants);
router.get('/filter/search', controller.filterRestaurants);
router.put('/:id/validate', controller.validateRestaurant);
router.put('/:id/reject', controller.rejectRestaurant);
router.get('/owner/:ownerId', controller.getByOwner);
router.get('/status/pending', controller.getPending);
router.get('/status/validated', controller.getValidated);
router.get('/admin/dashboard', controller.adminDashboard);

router.get('/dish/:id', controller.getDishById);

router.post('/', uploadRestaurant.single('image'), controller.create);
// ✅ Depois: rotas com parâmetros dinâmicos
router.get('/:id/menu', controller.getMenu);
router.post('/:id/menu', upload.single('image'), controller.addDish);
router.put('/:id/menu/:index', controller.updateDish);
router.delete('/:id/menu/:index', controller.removeDish);
router.get('/:id/menu/:index', controller.getDishByIndex);
router.post('/:id/menu/:index/image', upload.single('image'), controller.uploadDishImage);

router.put('/:id', uploadRestaurant.single('image'), controller.updateWithImage);
router.get('/:id', controller.getOne);  
router.delete('/:id', controller.remove);

module.exports = router;
