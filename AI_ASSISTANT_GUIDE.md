# AI Assistant Implementation Guide

Follow these steps to set up the AI Assistant feature using Gemini API in your PriceComp application.

## 1. Backend Setup

### Install Required Packages

```bash
cd backend
npm install @google/generative-ai
```

### Set up Environment Variables

Add the Gemini API key to your .env file in the backend directory:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** You need to obtain a Gemini API key from the Google AI Studio (https://makersuite.google.com/app/apikey)

## 2. How the AI Assistant Works

The AI Assistant feature provides users with:

1. **Shopping Assistant**: A chatbot that helps users with product searches and shopping advice
2. **Personalized Recommendations**: AI-generated product suggestions based on browsing history
3. **Product Questions**: Ability to ask specific questions about products

### Key Components

- **Frontend Chat Widget**: A floating chat bubble in the bottom-right corner that expands into a full chat interface
- **AI Service Layer**: API endpoints that communicate with the Gemini API
- **Gemini AI Integration**: Natural language processing for understanding and responding to user queries

## 3. Usage Examples

The AI Assistant can help users with:

### Shopping Advice
- "Which gaming laptop offers better value for money?"
- "Should I buy a smartwatch or fitness band for tracking workouts?"

### Product Comparisons
- "Compare iPhone 14 and Samsung Galaxy S23"
- "What's the difference between AirPods Pro and Sony WF-1000XM4?"

### Deal Finding
- "When is the best time to buy a TV?"
- "How can I get the best deals on electronics?"

### Product Questions
- "Is this camera good for low light photography?"
- "Does this washing machine have a steam feature?"

## 4. Customization Options

You can customize the AI Assistant by:

1. Modifying the prompts in `aiController.js` to change the AI's personality or response style
2. Updating the UI in `AIAssistant.jsx` to match your app's design
3. Adding more context about products to improve the relevance of AI responses

## 5. Testing the Implementation

After setting everything up:

1. Start both the backend and frontend servers
2. Navigate to any page on the website
3. Click the chat bubble icon in the bottom-right corner
4. Ask a shopping-related question to test the AI response