const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/manage', userController.getManage);
router.post('/:id/delete', userController.postDelete);

module.exports = router;
