const axios = require('axios');

// Search products across multiple platforms
const searchProducts = async (req, res, next) => {
  try {
    const { query, platforms } = req.body;
    const results = {};
    
    // Process each platform in parallel
    const platformPromises = platforms.map(platform => {
      return searchPlatform(platform, query)
        .then(data => {
          results[platform] = data;
        })
        .catch(error => {
          console.error(`Error searching ${platform}:`, error);
          results[platform] = { error: `Failed to fetch results from ${platform}` };
        });
    });
    
    await Promise.all(platformPromises);
    
    res.json(results);
  } catch (error) {
    next(error);
  }
};

// Helper function to search a specific platform
const searchPlatform = async (platform, query) => {
  // Configuration for different platforms
  const platformConfig = {
    amazon: {
      url: 'https://real-time-amazon-data.p.rapidapi.com/search',
      host: 'real-time-amazon-data.p.rapidapi.com',
      params: { q: query }
    },
    flipkart: {
      url: 'https://real-time-flipkart-data2.p.rapidapi.com/product-search',
      host: 'real-time-flipkart-data2.p.rapidapi.com',
      params: { query: query }
    }
  };
  
  const config = platformConfig[platform];
  
  if (!config) {
    throw new Error(`Platform ${platform} not supported`);
  }
  
  // Make the API call to RapidAPI
  const response = await axios.get(config.url, {
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': config.host
    },
    params: config.params
  });
  
  // Process and normalize the response data
  return normalizeResponse(platform, response.data);
};

// Helper function to normalize responses from different platforms
const normalizeResponse = (platform, data) => {
  // Different platforms have different response structures
  // This function normalizes them to a consistent format
  
  switch (platform) {
    case 'amazon':
      // Example normalization for Amazon data
      return (data.results || []).map(item => ({
        productName: item.title || '',
        price: parseFloat(item.price?.replace(/[^\d.]/g, '') || 0),
        rating: parseFloat(item.rating || 0),
        reviews: parseInt(item.reviews?.replace(/[^\d]/g, '') || 0),
        availability: item.availability || 'Unknown',
        link: item.link || '',
        image: item.image || ''
      }));
      
    case 'flipkart':
      // Example normalization for Flipkart data
      return (data.products || []).map(item => ({
        productName: item.name || '',
        price: parseFloat(item.price || 0),
        rating: parseFloat(item.rating || 0),
        reviews: parseInt(item.reviewCount || 0),
        availability: item.stock || 'Unknown',
        link: item.url || '',
        image: item.imageUrl || ''
      }));
      
    default:
      return [];
  }
};

module.exports = {
  searchProducts
};