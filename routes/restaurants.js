const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const upload = require('../utils/multerConfig');
const { verifyToken } = require('../controllers/authController'); // ✅ correto

// 🔐 Todas estas rotas protegidas com JWT
router.get('/register', verifyToken, restaurantController.getRegister);
router.post('/register', verifyToken, restaurantController.postRegister);
router.get('/list', verifyToken, restaurantController.getList);
router.get('/:id/manage', verifyToken, restaurantController.getManage);
router.get('/:id/add-menu', verifyToken, restaurantController.getAddMenu);
router.post('/:id/add-menu', verifyToken, upload.single('image'), restaurantController.postAddMenu);
router.get('/:id/edit-menu/:pratoIndex', verifyToken, restaurantController.getEditMenu);
router.get('/:id/menu/:pratoId', verifyToken, restaurantController.viewPrato);
router.get('/:id/edit-menu/:pratoIndex', verifyToken, restaurantController.getEditMenu);
router.post('/:id/edit-menu/:pratoIndex', verifyToken, upload.single('image'), restaurantController.postEditMenu);
router.post('/:id/remove-menu/:pratoIndex', verifyToken, restaurantController.postRemoveMenu);
router.get('/:id/menu/:pratoIndex', verifyToken, restaurantController.viewPrato);


module.exports = router;
