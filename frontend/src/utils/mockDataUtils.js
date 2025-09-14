import mockProducts from '../data/mockProducts.json';

/**
 * Search for products in the mock data based on query and selected platforms
 * @param {string} query - The search query
 * @param {Object} platforms - Object with platform names as keys and boolean values indicating selection
 * @returns {Object} - Search results grouped by platform
 */
export const searchMockProducts = (query, platforms) => {
  if (!query) return {};

  const results = {};
  const lowerQuery = query.toLowerCase();
  
  // Get all products as a flat array
  const allProducts = Object.values(mockProducts.products)
    .flat()
    .filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.category.toLowerCase().includes(lowerQuery)
    );

  // Filter by selected platforms and format response
  Object.keys(platforms).forEach(platform => {
    if (platforms[platform]) {
      results[platform] = allProducts
        .filter(product => product[platform]) // Only include products that have this platform
        .map(product => ({
          productName: product.name,
          price: product[platform].price,
          rating: product[platform].rating,
          reviews: product[platform].reviews,
          availability: product[platform].availability,
          link: product[platform].link,
          image: product[platform].image,
          category: product.category
        }));
    }
  });

  return results;
};

/**
 * Get a list of all available categories from the mock data
 * @returns {string[]} - Array of category names
 */
export const getMockCategories = () => {
  return Object.keys(mockProducts.products);
};

/**
 * Get all products for a specific category
 * @param {string} category - The category name
 * @param {Object} platforms - Object with platform names as keys and boolean values indicating selection
 * @returns {Object} - Products grouped by platform
 */
export const getProductsByCategory = (category, platforms) => {
  if (!mockProducts.products[category]) return {};
  
  const results = {};
  
  Object.keys(platforms).forEach(platform => {
    if (platforms[platform]) {
      results[platform] = mockProducts.products[category]
        .filter(product => product[platform])
        .map(product => ({
          productName: product.name,
          price: product[platform].price,
          rating: product[platform].rating,
          reviews: product[platform].reviews,
          availability: product[platform].availability,
          link: product[platform].link,
          image: product[platform].image,
          category: product.category
        }));
    }
  });
  
  return results;
};