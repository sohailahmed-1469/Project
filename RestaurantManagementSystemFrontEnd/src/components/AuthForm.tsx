import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [role, setRole] = useState<string>('USER');
  const [loading, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const { login, refreshAccessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenAndRefresh = async () => {
      if (localStorage.getItem('refreshToken')) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
    };

    checkTokenAndRefresh();
  }, [refreshAccessToken]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowPopup(false);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await authAPI.register({ userName, email, password, role });
        setIsLogin(true); 
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-lg font-semibold text-red-600">Invalid Credentials</h3>
            <p className="text-gray-700 mt-2">Try logging in again.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-indigo-600 text-white py-1 px-4 rounded-md hover:bg-indigo-700"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="MODERATOR">Moderator</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md transition-colors ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          disabled={loading}
        >
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            navigate(isLogin ? "/signup" : "/login");
          }}
          className="text-indigo-600 hover:text-indigo-500"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </motion.div>
  );
};
