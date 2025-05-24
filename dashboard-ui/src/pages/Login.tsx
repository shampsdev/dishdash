import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../shared/constants';

const Login: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken: setAuthToken } = useAuth();
  const navigate = useNavigate();

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // Create a temporary instance to test the token without affecting the global axios instance
      const tempAxios = axios.create({
        baseURL: `${API_URL}/api/v1`,
        headers: {
          'X-API-Token': token
        }
      });
      
      // Test request to validate token
      await tempAxios.get('/places/tag');
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!token.trim()) {
      setError('Please enter a token');
      setLoading(false);
      return;
    }
    
    // Validate token before allowing access
    const isValid = await validateToken(token);
    
    if (isValid) {
      setAuthToken(token);
      navigate('/');
    } else {
      setError('Invalid token. Authentication failed.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            DishDash Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your access token to continue
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="token" className="sr-only">
                Access Token
              </label>
              <input
                id="token"
                name="token"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Access Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 