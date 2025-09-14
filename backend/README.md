# Product Comparison Backend

A Node.js Express backend for a product comparison application that fetches data from multiple e-commerce platforms through RapidAPI.

## Features

- User authentication with JWT
- Rate limiting (1 request/second per user)
- Product search across multiple platforms (Amazon, Flipkart, Myntra)
- MongoDB integration for user data storage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a cloud instance)
- RapidAPI account with subscriptions to e-commerce APIs

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your credentials

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Product Search

- POST `/api/search` - Search products across platforms

## License

ISC