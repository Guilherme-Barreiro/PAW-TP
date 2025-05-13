const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/employeeController_api');
const { verifyToken } = require('../../controllers/api/authController_api');

router.use(verifyToken); // todas as rotas requerem token JWT do owner

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
