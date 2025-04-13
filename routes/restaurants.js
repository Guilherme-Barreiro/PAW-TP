const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const upload = require('../utils/multerConfig');
const { verifyToken } = require('../controllers/authController');

// ✅ ACESSO PÚBLICO
router.get('/list', restaurantController.getList);

// 🔐 ACESSO PROTEGIDO — A partir daqui precisa de login
router.use(verifyToken);

router.get('/register', restaurantController.getRegister);
router.post('/register', restaurantController.postRegister);
router.get('/:id/manage', restaurantController.getManage);
router.get('/:id/add-menu', restaurantController.getAddMenu);
router.post('/:id/add-menu', upload.single('image'), restaurantController.postAddMenu);
router.get('/:id/edit-menu/:pratoIndex', restaurantController.getEditMenu);
router.post('/:id/edit-menu/:pratoIndex', upload.single('image'), restaurantController.postEditMenu);
router.post('/:id/remove-menu/:pratoIndex', restaurantController.postRemoveMenu);
router.get('/:id/menu/:pratoIndex', restaurantController.viewPrato);

module.exports = router;
