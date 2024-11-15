const express = require('express');
const router = express.Router();
const { getAllEmployee,getEmployeeWithId,registerEmployee, loginEmployee, deleteEmployee, updateEmployee } = require('../controllers/employeeController');

// Route to get all employees
router.get('/all', getAllEmployee);
router.get('/:id', getEmployeeWithId);
router.post('/register', registerEmployee);
router.post('/login', loginEmployee);
router.delete('/:id', deleteEmployee);
router.put('/:id', updateEmployee);

module.exports = router;
