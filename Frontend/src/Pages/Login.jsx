import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation
    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://personalfinanceapp-production-3551.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setSuccess('Login successful! Redirecting...');
        setUser(data.user);

        // Store JWT token and user in localStorage for persistence
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Delay navigation slightly to show success message
        setTimeout(() => {
          navigate('/Dashboard');
        }, 1000);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Left side - Branding/Info */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl text-gray-300">
              Continue your financial journey with our personal finance platform
            </p>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm">📊</span>
              </div>
              <span className="text-gray-300">Track your expenses and income</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-sm">🎯</span>
              </div>
              <span className="text-gray-300">Set and achieve savings goals</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm">📈</span>
              </div>
              <span className="text-gray-300">Visualize your financial progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-4xl mb-2">💰</div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
            <div className="hidden lg:block mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-gray-400">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username/Email Field */}
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-300 mb-2">
                  Username or Email
                </label>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 pr-12"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    disabled={loading}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <div className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/SignUp" 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </div>
              
              <div className="text-gray-500 text-xs">
                <Link 
                  to="/" 
                  className="hover:text-gray-400 transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Your data is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
