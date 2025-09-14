# PriceComp Backend Documentation

## Overview

The PriceComp backend is built with Node.js and Express, providing a RESTful API for the frontend to interact with. This document details the backend architecture, API endpoints, data models, and implementation details.

## Table of Contents

1. [Project Structure](#project-structure)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Authentication](#authentication)
5. [Data Sources](#data-sources)
6. [Error Handling](#error-handling)
7. [Middleware](#middleware)
8. [Configuration](#configuration)
9. [Development and Production Environments](#development-and-production-environments)

## Project Structure

```
backend/
├── config/                # Configuration files
│   └── default.js         # Default configuration
├── controllers/           # Request handlers
│   ├── authController.js  # Authentication controller
│   └── productController.js # Product search controller
├── middleware/            # Custom middleware
│   ├── auth.js            # Authentication middleware
│   └── errorHandler.js    # Error handling middleware
├── models/                # Database models
│   ├── User.js            # User model
│   └── Product.js         # Product model
├── routes/                # API routes
│   ├── auth.js            # Authentication routes
│   └── products.js        # Product routes
├── services/              # Business logic
│   ├── authService.js     # Authentication service
│   └── scrapingService.js # Web scraping service
├── utils/                 # Utility functions
│   ├── logger.js          # Logging utility
│   └── validators.js      # Input validation
├── .env                   # Environment variables
├── package.json           # Dependencies
└── server.js              # Entry point
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | /api/auth/register | Register a new user | `{ name, email, password }` | `{ token, user }` |
| POST | /api/auth/login | Login existing user | `{ email, password }` | `{ token, user }` |
| GET | /api/auth/me | Get current user | None (Auth Token Required) | `{ user }` |

### Products

| Method | Endpoint | Description | Query Parameters | Response |
|--------|----------|-------------|-----------------|----------|
| GET | /api/products/search | Search products across platforms | `query`, `platforms` (comma-separated) | Array of product objects |
| GET | /api/products/categories | Get all product categories | None | Array of category objects |
| GET | /api/products/category/:id | Get products by category | `page`, `limit` | Array of product objects |
| POST | /api/products/track | Set up price tracking | `{ productId, email, notificationType, threshold }` | Confirmation message |

## Data Models

### User Model

```javascript
// User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hash middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

### Product Model

```javascript
// Product.js
const mongoose = require('mongoose');

const PriceHistorySchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['amazon', 'flipkart', 'myntra'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  category: {
    type: String,
    index: true
  },
  platforms: {
    amazon: {
      productId: String,
      price: Number,
      originalPrice: Number,
      rating: Number,
      ratings_count: Number,
      image: String,
      url: String,
      inStock: Boolean
    },
    flipkart: {
      productId: String,
      price: Number,
      originalPrice: Number,
      rating: Number,
      ratings_count: Number,
      image: String,
      url: String,
      inStock: Boolean
    },
    myntra: {
      productId: String,
      price: Number,
      originalPrice: Number,
      rating: Number,
      ratings_count: Number,
      image: String,
      url: String,
      inStock: Boolean
    }
  },
  priceHistory: [PriceHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update 'updatedAt' on save
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
ProductSchema.index({
  title: 'text',
  description: 'text'
});

module.exports = mongoose.model('Product', ProductSchema);
```

## Authentication

The backend uses JSON Web Tokens (JWT) for authentication:

```javascript
// authController.js excerpt
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('config');

// Login controller
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id },
      config.get('jwtSecret'),
      { expiresIn: '7d' }
    );
    
    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    
    res.json({ token, ...userData });
  } catch (err) {
    next(err);
  }
};
```

### Authentication Middleware

```javascript
// auth.js middleware
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Set user in request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

## Data Sources

The backend uses multiple approaches to retrieve product data:

### 1. Database Storage

Products that have been previously searched for are stored in MongoDB for quick retrieval.

### 2. Web Scraping Service

For new products or price updates, the backend implements a web scraping service:

```javascript
// scrapingService.js excerpt
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

// Amazon scraper
exports.scrapeAmazon = async (query) => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(query)}`);
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    const products = [];
    
    $('.s-result-item').each((i, el) => {
      const productId = $(el).attr('data-asin');
      if (!productId) return;
      
      const title = $(el).find('h2 .a-link-normal').text().trim();
      const priceText = $(el).find('.a-price-whole').first().text().trim();
      const price = priceText ? parseFloat(priceText.replace(/,/g, '')) : null;
      
      const originalPriceText = $(el).find('.a-text-price .a-offscreen').first().text().trim();
      const originalPrice = originalPriceText ? 
        parseFloat(originalPriceText.replace(/₹|,/g, '')) : price;
      
      const ratingText = $(el).find('.a-icon-star-small .a-icon-alt').first().text();
      const rating = ratingText ? parseFloat(ratingText.split(' ')[0]) : null;
      
      const ratingsCountText = $(el).find('.a-size-small .a-link-normal').first().text().trim();
      const ratingsCount = ratingsCountText ? 
        parseInt(ratingsCountText.replace(/[^0-9]/g, '')) : 0;
      
      const image = $(el).find('img.s-image').attr('src');
      const url = `https://www.amazon.in/dp/${productId}`;
      
      products.push({
        productId,
        title,
        price,
        originalPrice,
        rating,
        ratingsCount,
        image,
        url,
        inStock: price !== null
      });
    });
    
    return products.slice(0, 10); // Return top 10 results
  } finally {
    await browser.close();
  }
};

// Similar implementations for Flipkart and Myntra
```

### 3. Mock Data

For development and testing purposes, the backend also provides mock data:

```javascript
// mockData.js
const mockProducts = [
  {
    id: 'mock1',
    title: 'Smartphone X Pro',
    description: 'Latest smartphone with advanced features',
    category: 'Electronics',
    platforms: {
      amazon: {
        productId: 'AMZN123',
        price: 49999,
        originalPrice: 54999,
        rating: 4.5,
        ratings_count: 1245,
        image: 'https://example.com/phone.jpg',
        url: 'https://amazon.in/dp/AMZN123',
        inStock: true
      },
      flipkart: {
        productId: 'FLIP456',
        price: 48999,
        originalPrice: 54999,
        rating: 4.4,
        ratings_count: 982,
        image: 'https://example.com/phone.jpg',
        url: 'https://flipkart.com/product/FLIP456',
        inStock: true
      }
    }
  },
  // More products...
];
```

## Error Handling

The backend implements a centralized error handling middleware:

```javascript
// errorHandler.js
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages
    });
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};
```

## Middleware

### Request Validation

```javascript
// validators.js
const { body, validationResult } = require('express-validator');

exports.validateRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Similar validators for other endpoints
```

## Configuration

The application uses configuration files and environment variables:

```javascript
// default.js
module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  environment: process.env.NODE_ENV || 'development',
  scrapingEnabled: process.env.SCRAPING_ENABLED === 'true'
};
```

## Development and Production Environments

### Development Features

1. **Mock Data Toggle**: API can return mock data instead of real data
2. **Detailed Error Messages**: More verbose error messages
3. **CORS Configuration**: Permissive CORS settings for local development

```javascript
// CORS setup in development
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: 'http://localhost:3000' }));
} else {
  app.use(cors({ origin: process.env.CLIENT_URL }));
}
```

### Production Optimizations

1. **Caching**: Implement Redis caching for frequently requested data
2. **Rate Limiting**: Prevent abuse of the API

```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

if (process.env.NODE_ENV === 'production') {
  app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }));
}
```

3. **Security Headers**:

```javascript
// Security middleware
const helmet = require('helmet');
app.use(helmet());
```

---

This documentation covers the key aspects of the PriceComp backend implementation. For more detailed information on specific components or features, refer to the comments within the source code.