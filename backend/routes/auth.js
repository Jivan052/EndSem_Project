const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Validation middleware for registration
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validation middleware for login
const loginValidation = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').exists().withMessage('Password is required')
];

// Register route
router.post('/register', registerValidation, validateRequest, authController.register);

// Login route
router.post('/login', loginValidation, validateRequest, authController.login);

module.exports = router;