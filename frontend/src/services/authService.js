import api from './api';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration API error:', error);
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        throw { message: error.response.data.message };
      } else if (error.response.data.errors && error.response.data.errors.length > 0) {
        throw { message: error.response.data.errors[0].msg };
      }
    }
    throw { message: 'An error occurred during registration' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during login' };
  }
};

// Get current user from token
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};