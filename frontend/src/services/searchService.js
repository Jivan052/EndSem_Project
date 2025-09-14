import api from './api';

// Search products across platforms
export const searchProducts = async (searchData) => {
  try {
    const response = await api.post('/search', searchData);
    return response.data;
  } catch (error) {
    // Handle rate limiting errors specifically
    if (error.response?.status === 429) {
      throw { message: 'Too many requests. Please try again in a moment.' };
    }
    throw error.response?.data || { message: 'An error occurred during search' };
  }
};