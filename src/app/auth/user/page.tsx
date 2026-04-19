'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabaseClient';

export default function UserLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError('Email and password are required.');
          return;
        }

        const supabase = createSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setError(error.message || 'Login failed');
          return;
        }

        if (data.user) {
          localStorage.setItem('user', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username || '',
            fullName: data.user.user_metadata?.full_name || ''
          }));
          router.push('/user/dashboard');
        }
      } else {
        if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
          setError('All fields are required.');
          return;
        }

        const supabase = createSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              username: formData.username,
            },
          },
        });

        if (error) {
          setError(error.message || 'Registration failed');
          return;
        }

        if (data.user) {
          alert('Registration successful. Please check your email to confirm, then sign in.');
          setFormData({ username: '', email: '', password: '', fullName: '' });
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-gray-800 mb-2">Inn Sync</h1>
            <p className="text-sm text-gray-600">Smart Hotel-Booth Automation</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {isLogin ? 'Welcome Back!' : 'Join Us Today'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isLogin
                ? 'Experience seamless hotel booking, faster check-ins, and personalized services — all in one place.'
                : 'Sign up to experience seamless hotel booking, faster check-ins, and personalized services.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Full Name:</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center text-gray-700 text-sm">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  Remember me
                </label>
                <Link href="/user/forgot-password" className="text-blue-600 text-sm hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white font-semibold py-2 rounded hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ username: '', email: '', password: '', fullName: '' });
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                {isLogin ? 'Register here' : 'Sign in here'}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>By continuing, you agree to our Terms & Conditions</p>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 items-center justify-center p-8">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-bold mb-2">Welcome to Inn Sync</h3>
            <p className="text-lg">Your gateway to seamless hotel experiences</p>
          </div>
        </div>
      </div>
    </div>
  );
}
