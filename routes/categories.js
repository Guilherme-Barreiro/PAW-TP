const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.list);
router.get('/new', categoryController.showCreateForm);
router.post('/', categoryController.create);
router.get('/:id/edit', categoryController.showEditForm);
router.post('/:id', categoryController.update);
router.post('/:id/delete', categoryController.delete);

module.exports = router;
