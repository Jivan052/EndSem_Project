/**
 * Utility function to match products between Amazon and Flipkart based on product name similarity
 * @param {Array} amazonProducts - Array of Amazon products
 * @param {Array} flipkartProducts - Array of Flipkart products
 * @returns {Array} - Array of matched product pairs
 */
export const matchProducts = (amazonProducts = [], flipkartProducts = []) => {
  if (!amazonProducts?.length || !flipkartProducts?.length) {
    return [];
  }

  const matchedProducts = [];

  // For each Amazon product, find the most similar Flipkart product
  amazonProducts.forEach(amazonProduct => {
    const amazonName = amazonProduct.productName.toLowerCase();
    
    // Find the best match from Flipkart products
    let bestMatch = null;
    let highestSimilarity = 0;
    
    flipkartProducts.forEach(flipkartProduct => {
      const flipkartName = flipkartProduct.productName.toLowerCase();
      
      // Calculate simple similarity score (can be improved with more sophisticated algorithms)
      const similarity = calculateStringSimilarity(amazonName, flipkartName);
      
      // If this is a better match than what we have so far
      if (similarity > highestSimilarity && similarity > 0.6) { // 0.6 is a threshold for minimum similarity
        highestSimilarity = similarity;
        bestMatch = flipkartProduct;
      }
    });
    
    // If we found a good match, add it to our results
    if (bestMatch) {
      matchedProducts.push({
        amazon: amazonProduct,
        flipkart: bestMatch,
        similarityScore: highestSimilarity
      });
    }
  });

  // Sort by similarity score (highest first)
  return matchedProducts.sort((a, b) => b.similarityScore - a.similarityScore);
};

/**
 * Simple string similarity algorithm (Levenshtein distance based)
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare
 * @returns {number} - Similarity score between 0 and 1
 */
export const calculateStringSimilarity = (str1, str2) => {
  // For very simple matching, we'll just check for common words
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let commonWords = 0;
  
  words1.forEach(word => {
    if (word.length > 3 && words2.some(w2 => w2.includes(word) || word.includes(w2))) {
      commonWords++;
    }
  });
  
  // Calculate similarity as ratio of common words to average word count
  return commonWords / ((words1.length + words2.length) / 2);
};