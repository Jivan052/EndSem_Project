import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-[var(--foreground)] sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Compare Products</span>{' '}
          <span className="block text-[var(--primary)] xl:inline">Save Money</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-lg text-[var(--muted)] sm:text-xl md:mt-5 md:max-w-3xl">
          Find the best deals across Amazon, Flipkart, and Myntra in one place.
          Compare prices, ratings, and reviews to make informed purchases.
        </p>
        <div className="mt-10 flex justify-center">
          {isAuthenticated() ? (
            <Link
              to="/search"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-[var(--radius)] text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-opacity-90 md:py-4 md:text-lg md:px-10 shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Start Comparing
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/register"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-[var(--radius)] text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-opacity-90 md:py-4 md:text-lg md:px-10 shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register Now
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 border border-[var(--border)] text-base font-medium rounded-[var(--radius)] text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--accent)] md:py-4 md:text-lg md:px-10 shadow-md transition-all transform hover:-translate-y-0.5 hover:shadow-lg inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-8 relative inline-block mx-auto after:content-[''] after:absolute after:w-3/4 after:h-1 after:bg-[var(--primary)] after:left-1/2 after:-translate-x-1/2 after:-bottom-2">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-[var(--card)] shadow-lg rounded-lg p-6 text-center border border-[var(--border)] transition-all hover:shadow-xl">
            <div className="flex justify-center">
              <span className="inline-flex items-center justify-center p-4 bg-[var(--accent)] text-[var(--primary)] rounded-full shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">
              Search
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Enter the product you're looking for and select the platforms to compare
            </p>
          </div>
          <div className="bg-[var(--card)] shadow-lg rounded-lg p-6 text-center border border-[var(--border)] transition-all hover:shadow-xl transform translate-y-[-8px]">
            <div className="flex justify-center">
              <span className="inline-flex items-center justify-center p-4 bg-[var(--accent)] text-[var(--primary)] rounded-full shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">
              Compare
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              View side-by-side comparison of prices, ratings, and availability
            </p>
          </div>
          <div className="bg-[var(--card)] shadow-lg rounded-lg p-6 text-center border border-[var(--border)] transition-all hover:shadow-xl">
            <div className="flex justify-center">
              <span className="inline-flex items-center justify-center p-4 bg-[var(--accent)] text-[var(--primary)] rounded-full shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">
              Shop
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Choose the best deal and shop directly on your preferred platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;