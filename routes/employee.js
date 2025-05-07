const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken } = require('../controllers/authController');

// Rotas protegidas — só donos autenticados
router.post('/', verifyToken, employeeController.createEmployee);
router.get('/', verifyToken, employeeController.getEmployees);
router.put('/:id', verifyToken, employeeController.updateEmployee);
router.delete('/:id', verifyToken, employeeController.deleteEmployee);
router.get('/listEmployee', verifyToken, employeeController.renderEmployeeList);
router.get('/createEmployee', verifyToken, employeeController.getNewFuncionario);

router.get('/:id/edit', verifyToken, employeeController.getEditEmployee);
router.post('/:id/edit', verifyToken, employeeController.postEditEmployee);
router.post('/:id/delete', verifyToken, employeeController.deleteEmployee);

module.exports = router;
