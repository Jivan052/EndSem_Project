import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!name || !email || !password) {
      return setError('All fields are required');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      const { token, ...userData } = await register({ name, email, password });
      loginUser(userData, token);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[var(--card)] p-8 rounded-lg shadow-xl border border-[var(--border)]">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-[var(--foreground)]">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            Start comparing products and saving money
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] placeholder-[var(--muted)] text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] placeholder-[var(--muted)] text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] placeholder-[var(--muted)] text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--foreground)] mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] placeholder-[var(--muted)] text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input id="terms" name="terms" type="checkbox" className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)] rounded" />
            <label htmlFor="terms" className="ml-2 block text-sm text-[var(--muted)]">
              I agree to the <a href="#" className="text-[var(--primary)] hover:text-opacity-80">Terms and Conditions</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-50 transition-all duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-[var(--primary-foreground)] group-hover:text-opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </span>
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-[var(--muted)]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[var(--primary)] hover:text-opacity-80">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;