import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Password strength validation
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    return { minLength, hasNumber, hasLetter, isValid: minLength && hasNumber && hasLetter };
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const data = { username, email, password };
    setLoading(true);

    try {
      const response = await axios.post(
        'https://miraculous-beauty-production.up.railway.app//api/auth/signup', 
        data
      );

      if (response.status === 201) {
        setSuccess('Account created successfully! Redirecting...');
        
        // Store user and token in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);

        setUser(response.data.user);
        
        // Delay navigation to show success message
        setTimeout(() => {
          navigate('/Dashboard');
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(password);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-green-900">
      {/* Left side - Branding/Info */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
            <p className="text-xl text-gray-300">
              Join thousands of users taking control of their financial future
            </p>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-sm">✨</span>
              </div>
              <span className="text-gray-300">Free to start, no credit card required</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm">🔒</span>
              </div>
              <span className="text-gray-300">Bank-level security and encryption</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm">📱</span>
              </div>
              <span className="text-gray-300">Access anywhere, anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - SignUp Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-4xl mb-2">🚀</div>
            <h1 className="text-2xl font-bold text-white mb-2">Join Us Today</h1>
            <p className="text-gray-400">Create your account to get started</p>
          </div>

          {/* SignUp Form */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
            <div className="hidden lg:block mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Start managing your finances today</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username (min. 3 characters)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all duration-200"
                  disabled={loading}
                  autoComplete="username"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all duration-200"
                  disabled={loading}
                  autoComplete="email"
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
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all duration-200 pr-12"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    disabled={loading}
                  >
                    {showPassword ? 'x' : '👁'}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex space-x-1">
                      <div className={`h-1 flex-1 rounded ${passwordValidation.minLength ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <div className={`h-1 flex-1 rounded ${passwordValidation.hasLetter ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <div className={`h-1 flex-1 rounded ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Password must be 8+ characters with letters and numbers
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all duration-200 pr-12"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    disabled={loading}
                  >
                    {showConfirmPassword ? 'x' : '👁'}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="mt-1 text-xs text-red-400">
                    Passwords do not match
                  </div>
                )}
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


              {/* SignUp Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <div className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/LoginPage" 
                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Sign in here
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
               Your information is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
