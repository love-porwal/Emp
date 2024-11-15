const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllEmployee = async (req, res) => {
    try {
        const employees = await Employee.find(); // Retrieve all employee documents from MongoDB
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving employees', error: error.message });
    }
};

exports.getEmployeeWithId = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id); // Retrieve employee by ID from MongoDB
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving employee', error: error.message });
    }
};
exports.registerEmployee = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const employee = new Employee({ name, email, password: hashedPassword });
        await employee.save();
        res.status(201).json({ message: 'Employee registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering employee', error });
    }
};

exports.loginEmployee = async (req, res) => {
    const { email, password } = req.body;
    try {
        const employee = await Employee.findOne({ email });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: 'Login error', error });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting employee', error });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Employee updated', employee });
    } catch (error) {
        res.status(400).json({ message: 'Error updating employee', error });
    }
};
