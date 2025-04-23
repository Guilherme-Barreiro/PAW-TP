const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../controllers/authController');

// ✅ Público: ver categorias
router.get('/', categoryController.list);

// ✅ Protegido: apenas admin pode gerir categorias
router.use(verifyToken);
router.use(isAdmin);

router.get('/new', categoryController.showCreateForm);
router.post('/', categoryController.create);
router.get('/:id/edit', categoryController.showEditForm);
router.post('/:id', categoryController.update);
router.post('/:id/delete', categoryController.delete);

module.exports = router;
