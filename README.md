# PriceComp - Product Price Comparison Platform

![PriceComp](https://img.shields.io/badge/PriceComp-Product%20Comparison%20Platform-047857)
![React](https://img.shields.io/badge/React-18.0.0-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-16.x-339933)
![License](https://img.shields.io/badge/License-MIT-blue)

PriceComp is a comprehensive product price comparison platform that allows users to compare prices, ratings, and features across multiple e-commerce websites including Amazon, Flipkart, and Myntra.

## Project Overview

This project was created as a semester-end submission demonstrating full-stack development skills. It features a modern, responsive UI built with React and a REST API backend built with Node.js.

### Key Features

- **Cross-Platform Price Comparison**: Compare product prices across Amazon, Flipkart, and Myntra
- **Advanced Filtering Options**: Filter by price range, ratings, and availability
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Professional UI that works on desktop and mobile devices
- **Reverse Price Calculator**: Calculate potential savings based on target prices
- **Price Tracking**: Monitor price changes over time with customizable alerts
- **Category Browsing**: Browse products by category

## Tech Stack

### Frontend
- **React**: UI library for building component-based interfaces
- **TailwindCSS**: Utility-first CSS framework for styling
- **React Router**: For navigation and routing
- **Context API**: For state management

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **JWT**: For authentication
- **MongoDB**: NoSQL database for data storage

## Documentation

This repository includes detailed documentation for both frontend and backend components:

- [Frontend Documentation](./frontend/DOCUMENTATION.md)
- [Backend Documentation](./backend/DOCUMENTATION.md)

## Project Structure

```
EndSemProject/
├── frontend/           # React frontend application
│   ├── public/         # Static assets
│   └── src/            # Source files
│       ├── components/ # UI components
│       ├── context/    # Context API files
│       ├── pages/      # Page components
│       └── services/   # API services
└── backend/            # Node.js backend application
    ├── controllers/    # Request handlers
    ├── models/         # Database models
    ├── routes/         # API routes
    └── middleware/     # Custom middleware
```

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running the Backend
```bash
cd backend
npm install
npm run dev
```

## Design Choices

This project features a professional black and emerald green color scheme that creates a cohesive and modern user experience. Some key design decisions include:

1. **Consistent Color Palette**: Emerald green primary color (#047857) with dark text (#111827) on light backgrounds for readability
2. **Component-Based UI**: Reusable components for consistent styling and behavior
3. **Responsive Layout**: Mobile-first design approach that works on all screen sizes
4. **Interactive Elements**: Subtle animations and hover effects for better user engagement
5. **Accessible Design**: Proper contrast ratios and focus states for accessibility

## Future Enhancements

- Real-time price alerts via email notifications
- Price history graphs and trend analysis
- User reviews and product recommendations
- Browser extension for direct comparison while browsing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Icons provided by [Heroicons](https://heroicons.com/)
- Mock data based on real e-commerce listings
- Special thanks to all project contributors