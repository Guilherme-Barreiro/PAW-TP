const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const upload = require('../utils/multerConfig');
const { isAuthenticated } = require('../controllers/authController');

router.get('/register', isAuthenticated, restaurantController.getRegister);
router.post('/register', isAuthenticated, restaurantController.postRegister);
router.get('/list', isAuthenticated, restaurantController.getList);

router.get('/:id/manage', isAuthenticated, restaurantController.getManage);
router.get('/:id/add-menu', isAuthenticated, restaurantController.getAddMenu);
router.post('/:id/add-menu', isAuthenticated, upload.single('image'), restaurantController.postAddMenu);
router.post('/:id/edit-menu/:pratoIndex', isAuthenticated, upload.single('image'), restaurantController.postEditMenu);
router.get('/:id/edit-menu/:pratoIndex', isAuthenticated, restaurantController.getEditMenu);
router.post('/:id/edit-menu/:pratoIndex', isAuthenticated, restaurantController.postEditMenu);
router.post('/:id/remove-menu/:pratoIndex', isAuthenticated, restaurantController.postRemoveMenu);

module.exports = router;

