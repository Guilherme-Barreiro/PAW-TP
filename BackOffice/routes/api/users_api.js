const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/userController_api');

// Endpoints
router.get('/', userController.getAll);
router.delete('/:id', userController.remove);

module.exports = router;
