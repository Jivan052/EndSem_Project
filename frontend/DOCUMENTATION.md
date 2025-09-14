# PriceComp Frontend Documentation

## Overview

The PriceComp frontend is built with React and features a modern, responsive design using TailwindCSS for styling. This document provides a comprehensive overview of the frontend architecture, key components, and design decisions.

## Table of Contents

1. [Project Structure](#project-structure)
2. [UI/UX Design System](#uiux-design-system)
3. [Key Components](#key-components)
4. [Pages](#pages)
5. [State Management](#state-management)
6. [Services & API Integration](#services--api-integration)
7. [Features](#features)
8. [Responsive Design](#responsive-design)

## Project Structure

```
frontend/
├── public/                # Static assets and HTML template
└── src/                   # Source code
    ├── components/        # Reusable UI components
    │   ├── auth/          # Authentication-related components
    │   ├── layout/        # Layout components (Header, Footer)
    │   └── search/        # Search and comparison components
    ├── context/           # Context API providers
    │   └── AuthContext.js # Authentication context
    ├── pages/             # Page components
    │   ├── Home.jsx       # Landing page
    │   ├── Search.jsx     # Search and comparison page
    │   ├── Login.jsx      # User login page
    │   └── Register.jsx   # User registration page
    ├── services/          # API service functions
    │   ├── authService.js # Authentication API calls
    │   └── searchService.js # Product search API calls
    ├── assets/            # Images and other static assets
    ├── styles/            # Global CSS and theme variables
    ├── utils/             # Utility functions and helpers
    ├── App.jsx            # Root application component
    └── main.jsx          # Entry point
```

## UI/UX Design System

### Color Palette

The application uses a professional black and emerald green color scheme defined through CSS variables:

```css
:root {
  --background: #ffffff;
  --foreground: #111827;
  --card: #ffffff;
  --card-foreground: #111827;
  --primary: #047857;      /* Primary emerald green */
  --primary-foreground: #ffffff;
  --secondary: #f9fafb;
  --secondary-foreground: #374151;
  --accent: #ecfdf5;       /* Light emerald for accents */
  --accent-foreground: #065f46;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e5e7eb;
  --input: #e5e7eb;
  --ring: #10b981;
  --radius: 0.375rem;
  --muted: #6b7280;
}
```

### Typography

- **Headings**: System font stack with heavier weights for impact
- **Body Text**: System font stack optimized for readability
- **Special Elements**: Gradient text effects for emphasis

### Components & Styling

All UI components use TailwindCSS for styling with a consistent approach:

- **Buttons**: Primary actions use emerald green background, secondary actions use outlined style
- **Cards**: White background with subtle border and shadow effects
- **Inputs**: Clean design with proper focus states
- **Icons**: Consistent use of Heroicons throughout the application

## Key Components

### Header/Navbar

The main navigation component featuring:
- Logo with emerald accent
- Responsive navigation links
- Authentication state-aware UI (login/logout)
- Mobile menu for smaller screens

```jsx
// Header.jsx excerpt
<header className="bg-[var(--card)] border-b border-[var(--border)] shadow-md">
  <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      {/* Logo and navigation */}
      <div className="flex">
        <Link to="/" className="text-xl font-bold text-[var(--primary)] flex items-center">
          <svg className="h-6 w-6 mr-2" {...props} />
          <span>PriceComp</span>
        </Link>
      </div>
      
      {/* Authentication-aware user actions */}
      <div className="flex items-center">
        {user ? (
          <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-md">Logout</button>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="text-[var(--foreground)]">Login</Link>
            <Link to="/register" className="bg-[var(--primary)] text-white px-4 py-2 rounded-md">Register</Link>
          </div>
        )}
      </div>
    </div>
  </nav>
</header>
```

### Product Comparison Card

Displays side-by-side comparison of products across platforms:

```jsx
// Comparison card excerpt
<div className="bg-[var(--card)] shadow-lg rounded-lg overflow-hidden border border-[var(--border)]">
  <div className="grid grid-cols-2 gap-2">
    {/* Amazon product */}
    <div className="p-4 border-r border-[var(--border)]">
      <div className="flex items-center mb-2">
        <span className="text-amazon font-medium">Amazon</span>
        <span className="ml-auto">₹{product.amazon.price}</span>
      </div>
      <img src={product.amazon.image} alt={product.amazon.title} className="w-full h-48 object-contain" />
      <div className="mt-2">
        <div className="flex items-center">
          <StarRating rating={product.amazon.rating} />
          <span className="ml-2 text-sm text-[var(--muted)]">({product.amazon.ratings_count})</span>
        </div>
      </div>
    </div>
    
    {/* Flipkart product */}
    <div className="p-4">
      {/* Similar structure as Amazon */}
    </div>
  </div>
  
  {/* Price comparison and recommendation */}
  <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2">
    <p className="text-xs font-medium text-white">
      {product.amazon.price < product.flipkart.price ? (
        <span className="text-amazon">Amazon has a better price by ₹{diff} ({diffPercent}% less)</span>
      ) : (
        <span className="text-flipkart">Flipkart has a better price by ₹{diff} ({diffPercent}% less)</span>
      )}
    </p>
  </div>
</div>
```

## Pages

### Home Page

The landing page features:
- Hero section with animated call-to-action buttons
- "How It Works" section with three feature cards
- Authentication-aware navigation options

### Search Page

The main product comparison interface:
- Search input with platform selection
- Category browsing section
- Product comparison cards
- Reverse calculator feature
- Price tracking functionality

### Login & Register Pages

User authentication interfaces with:
- Form validation
- Error handling
- Clean, professional design
- Responsive layout

## State Management

The application uses React's Context API for global state management:

### Authentication Context

Manages user authentication state throughout the application:

```jsx
// AuthContext.js excerpt
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);
  
  // Login function
  const loginUser = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };
  
  // Logout function
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  // Authentication check
  const isAuthenticated = () => {
    return !!user;
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Services & API Integration

The application uses service modules to handle API interactions:

### Search Service

```javascript
// searchService.js excerpt
export const searchProducts = async (query, platforms) => {
  try {
    const response = await fetch(`/api/search?query=${query}&platforms=${platforms.join(',')}`);
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Mock data for development
export const searchMockProducts = (query) => {
  // Implementation of mock data search
  return mockProducts.filter(product => 
    product.title.toLowerCase().includes(query.toLowerCase())
  );
};
```

## Features

### Reverse Price Calculator

Allows users to input a target price and see potential savings:

```jsx
// Reverse calculator excerpt
<div className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] shadow-md">
  <h3 className="text-lg font-medium text-[var(--foreground)] mb-3">Target Price Calculator</h3>
  
  <div className="flex items-center space-x-2 mb-4">
    <input
      type="number"
      value={targetPrice}
      onChange={(e) => setTargetPrice(e.target.value)}
      className="rounded-md border border-[var(--border)] px-3 py-2 w-full"
      placeholder="Enter your target price"
    />
    <button 
      onClick={calculateSavings}
      className="bg-[var(--primary)] text-white px-4 py-2 rounded-md"
    >
      Calculate
    </button>
  </div>
  
  {calculationResult && (
    <div className="text-sm">
      <p>Amazon savings: ₹{amazonSavings} ({amazonPercentage}%)</p>
      <p>Flipkart savings: ₹{flipkartSavings} ({flipkartPercentage}%)</p>
      <p className="font-medium mt-2">
        {recommendation}
      </p>
    </div>
  )}
</div>
```

### Price Tracking System

Allows users to track price changes over time:

```jsx
// Price tracking component excerpt
<div className="tracking-panel">
  <h3 className="text-lg font-medium">Track Price Changes</h3>
  
  <div className="flex items-center space-x-2 my-3">
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Your email address"
      className="input-field"
    />
    <select 
      value={notificationType} 
      onChange={(e) => setNotificationType(e.target.value)}
      className="select-field"
    >
      <option value="any">Any price change</option>
      <option value="decrease">Price decrease only</option>
      <option value="threshold">Below threshold</option>
    </select>
  </div>
  
  {notificationType === 'threshold' && (
    <input
      type="number"
      value={threshold}
      onChange={(e) => setThreshold(e.target.value)}
      placeholder="Price threshold"
      className="input-field mb-3"
    />
  )}
  
  <button onClick={setupTracking} className="tracking-button">
    <svg className="h-5 w-5 mr-2" {...props} />
    Track This Product
  </button>
</div>
```

## Responsive Design

The application is built with a mobile-first approach and adapts to different screen sizes:

- **Desktop**: Full multi-column layout with side-by-side comparisons
- **Tablet**: Adjusted spacing and grid layouts
- **Mobile**: Single column layout with stacked comparison cards

```jsx
// Responsive grid example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards rendered here */}
</div>
```

Media queries are handled through TailwindCSS's responsive prefixes:
- `sm:` (640px and above)
- `md:` (768px and above)
- `lg:` (1024px and above)
- `xl:` (1280px and above)

---

This documentation covers the key aspects of the PriceComp frontend implementation. For more detailed information on specific components or features, refer to the comments within the source code.