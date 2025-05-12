const express = require('express');
const router = express.Router();
const restaurantController = require('../../controllers/api/restaurantController_api');

// Rotas RESTful
router.get('/', restaurantController.getAll);
router.get('/:id', restaurantController.getOne);
router.post('/', restaurantController.create);
router.put('/:id', restaurantController.update);
router.delete('/:id', restaurantController.remove);
router.get('/:id/menu', controller.getMenu);
router.post('/:id/menu', controller.addDish);
router.put('/:id/menu/:index', controller.updateDish);
router.delete('/:id/menu/:index', controller.removeDish);
router.get('/filter', restaurantController.filterRestaurants);
router.put('/:id/validate', restaurantController.validateRestaurant);
router.put('/:id/reject', restaurantController.rejectRestaurant);
router.get('/owner/:ownerId', restaurantController.getByOwner);
router.get('/status/pending', restaurantController.getPending);
router.get('/status/validated', restaurantController.getValidated);

module.exports = router;
