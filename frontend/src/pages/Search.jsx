import { useState, useMemo, useEffect } from 'react';
import { searchProducts } from '../services/searchService';
import { searchMockProducts, getMockCategories, getProductsByCategory } from '../utils/mockDataUtils';
import { matchProducts } from '../utils/productMatching';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [platforms, setPlatforms] = useState({
    amazon: true,
    flipkart: true
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'comparison'
  
  // State for experimental mock data version
  const [useExperimentalMode, setUseExperimentalMode] = useState(false);
  const [mockResults, setMockResults] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Fetch available categories on component mount when in experimental mode
  useEffect(() => {
    if (useExperimentalMode) {
      const availableCategories = getMockCategories();
      setCategories(availableCategories);
    }
  }, [useExperimentalMode]);
  
  // Compute matched products for comparison view
  const matchedProducts = useMemo(() => {
    const currentResults = useExperimentalMode ? mockResults : results;
    
    if (!currentResults?.amazon || !currentResults?.flipkart) {
      return [];
    }
    
    return matchProducts(currentResults.amazon, currentResults.flipkart);
  }, [results, mockResults, useExperimentalMode]);
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    if (category === selectedCategory) {
      setSelectedCategory('');
      setMockResults(null);
      return;
    }
    
    setSelectedCategory(category);
    setLoading(true);
    
    // Use the getProductsByCategory function to get products for the selected category
    const categoryResults = getProductsByCategory(category, platforms);
    setMockResults(categoryResults);
    setLoading(false);
  };

  const handlePlatformChange = (platform) => {
    setPlatforms({
      ...platforms,
      [platform]: !platforms[platform]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMockResults(null);
    setResults(null);

    // Validate search input
    if (!query.trim()) {
      return setError('Please enter a search term');
    }

    // Check if at least one platform is selected
    const selectedPlatforms = Object.keys(platforms).filter(key => platforms[key]);
    if (selectedPlatforms.length === 0) {
      return setError('Please select at least one platform');
    }

    try {
      setLoading(true);
      
      if (useExperimentalMode) {
        // Use mock data instead of API
        const mockData = searchMockProducts(query.trim(), platforms);
        setMockResults(mockData);
      } else {
        // Use real API
        const data = await searchProducts({
          query: query.trim(),
          platforms: selectedPlatforms
        });
        setResults(data);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle between real API and experimental mock data
  const toggleExperimentalMode = () => {
    const newMode = !useExperimentalMode;
    setUseExperimentalMode(newMode);
    setResults(null);
    setMockResults(null);
    setSelectedCategory('');
    
    if (newMode) {
      // Load categories when switching to experimental mode
      const availableCategories = getMockCategories();
      setCategories(availableCategories);
    } else {
      setCategories([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[var(--background)]">
      <div className="bg-[var(--card)] shadow-lg rounded-lg p-6 border border-[var(--border)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--card-foreground)]">
            <span className="border-l-4 border-[var(--primary)] pl-3">Compare Products Across Platforms</span>
          </h1>
          
          <div className="flex items-center gap-2">
            {useExperimentalMode && selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className="px-2.5 py-1.5 border border-[var(--border)] rounded-[var(--radius)] shadow-sm text-xs font-medium bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[var(--ring)] transition-colors"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Category
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={toggleExperimentalMode}
              className={`px-3.5 py-2 border rounded-[var(--radius)] shadow-sm text-sm font-medium transition-colors ${
                useExperimentalMode 
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-opacity-90 border-transparent' 
                  : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--accent)] border-[var(--border)]'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ring)]`}
            >
              {useExperimentalMode ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Using Test Data
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Use Test Data
                </span>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-md shadow-sm mb-4" role="alert">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="block sm:inline font-medium">{error}</span>
            </div>
          </div>
        )}
        
            {/* Show available categories when in experimental mode */}
        {useExperimentalMode && categories.length > 0 && (
          <div className="mb-6 p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
            <h2 className="text-lg font-medium text-[var(--card-foreground)] mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-[var(--radius)] transition-all ${
                    selectedCategory === category 
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md' 
                      : 'bg-white text-[var(--secondary-foreground)] hover:bg-[var(--accent)] border border-[var(--border)]'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  {selectedCategory === category && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-xs rounded-full bg-white bg-opacity-30">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-[var(--foreground)]">
              Search Products
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="relative">
                <input
                  type="text"
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="focus:ring-[var(--ring)] focus:border-[var(--ring)] block w-full pl-10 pr-4 py-3 sm:text-sm border-[var(--border)] rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)]"
                  placeholder="Enter product name, brand, or keywords..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <fieldset>
              <legend className="text-sm font-medium text-[var(--foreground)]">
                Select Platforms
              </legend>
              <div className="mt-2 flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input
                    id="amazon"
                    name="amazon"
                    type="checkbox"
                    checked={platforms.amazon}
                    onChange={() => handlePlatformChange('amazon')}
                    className="focus:ring-[var(--ring)] h-4 w-4 text-[var(--primary)] border-[var(--border)] rounded"
                  />
                  <label htmlFor="amazon" className="ml-2 block text-sm text-[var(--foreground)]">
                    Amazon
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="flipkart"
                    name="flipkart"
                    type="checkbox"
                    checked={platforms.flipkart}
                    onChange={() => handlePlatformChange('flipkart')}
                    className="focus:ring-[var(--ring)] h-4 w-4 text-[var(--primary)] border-[var(--border)] rounded"
                  />
                  <label htmlFor="flipkart" className="ml-2 block text-sm text-[var(--foreground)]">
                    Flipkart
                  </label>
                </div>

              </div>
            </fieldset>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || (useExperimentalMode && selectedCategory)}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-[var(--radius)] shadow-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ring)] disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Search and Compare
                </span>
              )}
            </button>
          </div>
        </form>
        
        {/* View mode toggle */}
        {(results || mockResults) && !loading && platforms.amazon && platforms.flipkart && (
          <div className="mt-4 flex justify-center">
            <div className="inline-flex rounded-[var(--radius)] shadow-md" role="group">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-4 py-2.5 text-sm font-medium rounded-l-[var(--radius)] transition-all ${
                  viewMode === 'list'
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                } border border-[var(--border)] flex items-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2.5 text-sm font-medium rounded-r-[var(--radius)] transition-all ${
                  viewMode === 'comparison'
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                } border border-[var(--border)] border-l-0 flex items-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Compare
              </button>
            </div>
          </div>
        )}
        
        {useExperimentalMode && (
          <div className="mt-4 p-3 bg-[var(--accent)] border-l-4 border-[var(--primary)] rounded-r-[var(--radius)] shadow-sm flex justify-between items-center">
            <p className="text-sm text-[var(--accent-foreground)] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Test Mode Active:</span> Using local test data instead of live API.
            </p>
            {selectedCategory && (
              <span className="text-sm font-medium bg-white bg-opacity-60 px-3 py-1 rounded-full flex items-center shadow-sm border border-[var(--border)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </span>
            )}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200">
              <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
          </div>
        )}

        {(results || mockResults) && !loading && (
          <div className="mt-8">
                    <h2 className="text-xl font-semibold text-[var(--card-foreground)] mb-4 pb-2 border-b border-[var(--border)]">
              {selectedCategory ? (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Browsing {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products 
                  <span className="ml-2 text-sm font-normal text-[var(--primary)] px-2 py-0.5 bg-[var(--accent)] rounded-full">(Test Data)</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Results for "{query}" {useExperimentalMode && <span className="ml-2 text-sm font-normal text-[var(--primary)] px-2 py-0.5 bg-[var(--accent)] rounded-full">(Test Data)</span>}
                </div>
              )}
            </h2>            {/* List View Mode */}
            {viewMode === 'list' && (
              <div className="overflow-x-auto">
                {Object.keys(useExperimentalMode ? mockResults : results).map(platform => (
                  <div key={platform} className="mt-6">
                    <h3 className="text-lg font-medium text-[var(--card-foreground)] capitalize mb-2">
                      {platform} Results
                    </h3>
                    
                    {Array.isArray((useExperimentalMode ? mockResults : results)[platform]) && 
                     (useExperimentalMode ? mockResults : results)[platform].length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[var(--secondary)]">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--secondary-foreground)] uppercase tracking-wider">
                              Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--secondary-foreground)] uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--secondary-foreground)] uppercase tracking-wider">
                              Rating
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--secondary-foreground)] uppercase tracking-wider">
                              Reviews
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--secondary-foreground)] uppercase tracking-wider">
                              Availability
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--secondary-foreground)] uppercase tracking-wider">
                              Link
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-[var(--background)] divide-y divide-[var(--border)]">
                          {(useExperimentalMode ? mockResults : results)[platform].map((product, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {product.image && (
                                    <div className="flex-shrink-0 h-10 w-10 mr-4">
                                      <img className="h-10 w-10 object-cover" src={product.image} alt={product.productName} />
                                    </div>
                                  )}
                                  <div className="text-sm font-medium text-[var(--foreground)]">
                                    {product.productName}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[var(--foreground)]">₹{product.price}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="text-sm text-[var(--foreground)] mr-1">{product.rating}</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--secondary-foreground)]">
                                {product.reviews}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.availability === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {product.availability}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:text-[var(--ring)]">
                                  Visit
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-[var(--secondary-foreground)]">No products found on {platform}.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Side-by-Side Comparison View Mode */}
            {viewMode === 'comparison' && (
              <div className="mt-4">
                {matchedProducts.length > 0 ? (
                  <div>
                    <p className="text-[var(--secondary-foreground)] text-sm mb-4">
                      Showing {matchedProducts.length} matched product{matchedProducts.length !== 1 ? 's' : ''} across platforms
                    </p>
                    
                    {matchedProducts.map((match, index) => (
                      <div key={index} className="bg-[var(--card)] rounded-[var(--radius)] shadow-lg overflow-hidden mb-5 border border-[var(--border)] transition-all hover:shadow-xl">
                        <div className="bg-gradient-to-r from-[var(--primary)] to-[#065f46] px-3 py-2 border-b border-[var(--border)]">
                          <h3 className="text-base font-medium text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            Product Match #{index + 1}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-2 divide-x">
                          {/* Amazon Product */}
                          <div className="p-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 mr-2">
                                {match.amazon.image && (
                                  <img className="h-10 w-10 object-cover rounded" src={match.amazon.image} alt={match.amazon.productName} />
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-amazon">Amazon</h4>
                                <p className="text-xs font-medium text-[var(--foreground)] line-clamp-2">{match.amazon.productName}</p>
                              </div>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-[var(--secondary-foreground)]">Price</p>
                                <p className={`text-base font-bold ${
                                  match.amazon.price < match.flipkart.price ? 'text-green-600' : 
                                  match.amazon.price > match.flipkart.price ? 'text-red-600' : 'text-[var(--foreground)]'
                                }`}>
                                  ₹{match.amazon.price}
                                  {match.amazon.price < match.flipkart.price && (
                                    <span className="block text-xs font-medium text-green-600">
                                      BETTER DEAL! Save ₹{(match.flipkart.price - match.amazon.price).toFixed(2)}
                                    </span>
                                  )}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-[var(--secondary-foreground)]">Rating</p>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-[var(--foreground)] mr-1">{match.amazon.rating}</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="text-xs text-[var(--secondary-foreground)] ml-1">({match.amazon.reviews})</span>
                                </div>
                              </div>
                              
                              <div className="col-span-2">
                                <p className="text-xs text-[var(--secondary-foreground)]">Availability</p>
                                <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${match.amazon.availability === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {match.amazon.availability}
                                </span>
                              </div>
                              
                              <div className="col-span-2">
                                <a 
                                  href={match.amazon.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="block w-full text-center px-2 py-1.5 border border-transparent rounded-md shadow-md text-xs font-medium text-white bg-amazon hover:bg-amazon-dark focus:outline-none transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                  <span className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View on Amazon
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          {/* Flipkart Product */}
                          <div className="p-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 mr-2">
                                {match.flipkart.image && (
                                  <img className="h-10 w-10 object-cover rounded" src={match.flipkart.image} alt={match.flipkart.productName} />
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-flipkart">Flipkart</h4>
                                <p className="text-xs font-medium text-[var(--foreground)] line-clamp-2">{match.flipkart.productName}</p>
                              </div>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-[var(--secondary-foreground)]">Price</p>
                                <p className={`text-base font-bold ${
                                  match.flipkart.price < match.amazon.price ? 'text-green-600' : 
                                  match.flipkart.price > match.amazon.price ? 'text-red-600' : 'text-[var(--foreground)]'
                                }`}>
                                  ₹{match.flipkart.price}
                                  {match.flipkart.price < match.amazon.price && (
                                    <span className="block text-xs font-medium text-green-600">
                                      BETTER DEAL! Save ₹{(match.amazon.price - match.flipkart.price).toFixed(2)}
                                    </span>
                                  )}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-[var(--secondary-foreground)]">Rating</p>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-[var(--foreground)] mr-1">{match.flipkart.rating}</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="text-xs text-[var(--secondary-foreground)] ml-1">({match.flipkart.reviews})</span>
                                </div>
                              </div>
                              
                              <div className="col-span-2">
                                <p className="text-xs text-[var(--secondary-foreground)]">Availability</p>
                                <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${match.flipkart.availability === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {match.flipkart.availability}
                                </span>
                              </div>
                              
                              <div className="col-span-2">
                                <a 
                                  href={match.flipkart.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="block w-full text-center px-2 py-1.5 border border-transparent rounded-md shadow-md text-xs font-medium text-white bg-flipkart hover:bg-flipkart-dark focus:outline-none transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                  <span className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View on Flipkart
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Overall recommendation */}
                        <div className="bg-[var(--accent)] px-4 py-3 shadow-inner">
                          <p className="font-medium flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {match.amazon.price < match.flipkart.price ? (
                              <span className="text-amazon flex items-center">
                                <span className="font-bold">Amazon</span> has a better price by <span className="font-bold mx-1">₹{(match.flipkart.price - match.amazon.price).toFixed(2)}</span> ({((match.flipkart.price - match.amazon.price) / match.flipkart.price * 100).toFixed(1)}% less)
                              </span>
                            ) : match.flipkart.price < match.amazon.price ? (
                              <span className="text-flipkart flex items-center">
                                <span className="font-bold">Flipkart</span> has a better price by <span className="font-bold mx-1">₹{(match.amazon.price - match.flipkart.price).toFixed(2)}</span> ({((match.amazon.price - match.flipkart.price) / match.amazon.price * 100).toFixed(1)}% less)
                              </span>
                            ) : (
                              <span className="text-[var(--foreground)] flex items-center">
                                <span className="font-bold mr-1">Same price</span> on both platforms
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  platforms.amazon && platforms.flipkart ? (
                    <p className="text-[var(--secondary-foreground)]">No matching products found across platforms for comparison.</p>
                  ) : (
                    <p className="text-[var(--secondary-foreground)]">Please select both Amazon and Flipkart platforms for comparison view.</p>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;