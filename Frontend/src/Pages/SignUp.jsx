import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/spinner';
import { UserContext } from '../UserContext';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate(); 

  const handleSignUp = () => {
    setError('');
    if (!username || !email || !password) {
      setError('Please fill all fields.');
      return;
    }

    const data = { username, email, password };
    setLoading(true);

    axios
      .post('http://localhost:5555/api/auth/signup', data)
      .then((response) => {
        setLoading(false);
        if (response.status === 201) {
          // Store user and token in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);

          setUser(response.data.user); // Set user context
          navigate('/Dashboard');      // Redirect to dashboard
        } else {
          setError(response.data.message || 'Signup failed.');
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong. Please try again.');
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {loading ? (
        <Spinner/>
      ) : (
        <div className="bg-white p-8 rounded-md shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline invalid:border-red-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSignUp}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
