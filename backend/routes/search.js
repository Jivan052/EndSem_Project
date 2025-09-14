const express = require('express');
const { body } = require('express-validator');
const searchController = require('../controllers/searchController');
const { protect } = require('../middleware/auth');
const rateLimitMiddleware = require('../middleware/rateLimiter');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Validation middleware for search
const searchValidation = [
  body('query').notEmpty().withMessage('Search query is required'),
  body('platforms').isArray({ min: 1 }).withMessage('At least one platform must be selected'),
  body('platforms.*').isIn(['amazon', 'flipkart']).withMessage('Invalid platform')
];

// Apply authentication and rate limiting to search route
router.post('/', protect, rateLimitMiddleware, searchValidation, validateRequest, searchController.searchProducts);

module.exports = router;