const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken } = require('../middleware/auth.middleware');

// Aplicar verifyToken para garantir que só donos autenticados acedem
router.post('/', verifyToken, employeeController.createEmployee);
router.get('/', verifyToken, employeeController.getEmployees);
router.put('/:id', verifyToken, employeeController.updateEmployee);
router.delete('/:id', verifyToken, employeeController.deleteEmployee);

module.exports = router;
